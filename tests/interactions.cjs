// Logic checks with a DOM mock; real browser rendering must be checked separately.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const decode = text => text.replace(/&amp;/g, '&').replace(/&copy;/g, '\u00a9');

function page(language = 'en', storageBlocked = false) {
    const nodes = [], requests = [], errors = [], documentEvents = {}, mediaEvents = {}, timers = new Map();
    let document;
    function matches(node, selector) {
        if (selector.startsWith('.')) return node.classList.contains(selector.slice(1));
        if (selector === '[data-i18n]') return 'i18n' in node.dataset;
        if (selector === 'section[id]') return node.tagName === 'section' && node.id;
        return node.tagName === selector;
    }
    class Element {
        constructor(tag, attrs = {}) {
            this.tagName = tag; this.attrs = attrs; this.children = []; this.events = {};
            this.style = {setProperty() {}}; this.value = ''; this._text = ''; this.offsetTop = 100; this.offsetHeight = 70;
            this.id = attrs.id || ''; this.inert = 'inert' in attrs; this.disabled = 'disabled' in attrs;
            this.readOnly = 'readonly' in attrs;
            this.dataset = Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith('data-')).map(([k,v]) => [k.slice(5).replace(/-([a-z])/g, (_,c) => c.toUpperCase()),v]));
            const classes = new Set((attrs.class || '').split(/\s+/));
            this.classList = {
                add: (...v) => v.forEach(c => classes.add(c)), remove: (...v) => v.forEach(c => classes.delete(c)),
                contains: c => classes.has(c), toggle: (c, force) => { const active = force ?? !classes.has(c); active ? classes.add(c) : classes.delete(c); return active; }
            };
            nodes.push(this);
        }
        get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
        set textContent(value) { this._text = String(value); this.children = []; }
        set innerHTML(value) { throw Error('Unexpected HTML sink'); }
        getAttribute(name) { return this.attrs[name] ?? null; }
        setAttribute(name, value) { this.attrs[name] = String(value); }
        removeAttribute(name) { delete this.attrs[name]; }
        appendChild(child) { child.parent = this; this.children.push(child); }
        append(...children) { children.forEach(child => this.appendChild(child)); }
        insertBefore(child, reference) { child.parent = this; this.children.splice(this.children.indexOf(reference),0,child); }
        replaceChildren(...children) { this._text = ''; this.children = children; }
        contains(node) { return node === this || this.children.some(c => c.contains(node)); }
        focus() { document.activeElement = this; }
        getBoundingClientRect() { return {height:70,top:100,bottom:170}; }
        addEventListener(name, callback) { (this.events[name] ??= []).push(callback); }
        emit(name, event = {}) { return Promise.all((this.events[name] || []).map(callback => callback({preventDefault() {}, ...event}))); }
        querySelector(selector) { return nodes.find(n => n !== this && this.contains(n) && matches(n,selector)) || null; }
    }
    const base = new Element('root'), stack = [base];
    const voidTags = new Set(['meta','link','input','br','hr','img','path']);
    for (const token of html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g)) {
        const value = token[0];
        if (value.startsWith('<!')) continue;
        if (value.startsWith('</')) { if (stack.at(-1).tagName === value.slice(2,-1)) stack.pop(); continue; }
        if (value.startsWith('<')) {
            const tag = /^<([\w-]+)/.exec(value)[1], attrs = {};
            for (const m of value.slice(tag.length+1).matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[m[1]] = decode(m[2] ?? '');
            const node = new Element(tag,attrs); stack.at(-1).appendChild(node);
            if (!voidTags.has(tag)) stack.push(node);
        } else stack.at(-1)._text += decode(value);
    }
    document = {
        activeElement:null, documentElement:nodes.find(n => n.tagName === 'html'), body:nodes.find(n => n.tagName === 'body'),
        getElementById:id => nodes.find(n => n.id === id),
        querySelector:s => nodes.find(n => matches(n,s)) || null,
        querySelectorAll:s => nodes.filter(n => matches(n,s)),
        createElement:tag => new Element(tag),
        addEventListener:(name,callback) => (documentEvents[name] ??= []).push(callback)
    };
    const storage = new Map([['language',language]]);
    const context = vm.createContext({document, AbortController,
        window:{scrollY:0,scrollTo() {},addEventListener() {},matchMedia:()=>({matches:false,addEventListener:(name,cb)=>mediaEvents[name]=cb})},
        localStorage:{getItem:key=>{if(storageBlocked)throw Error('blocked');return storage.get(key)??null;},setItem:(key,value)=>{if(storageBlocked)throw Error('blocked');storage.set(key,value);}},
        console:{error:(...args)=>errors.push(args),warn() {}},
        setTimeout:(cb,delay)=>{const key=Symbol();timers.set(key,{cb,delay});return key;},clearTimeout:key=>timers.delete(key),
        fetch:(url,options)=>new Promise((resolve,reject)=>{
            requests.push({url,options,resolve,reject});
            options.signal?.addEventListener('abort',()=>reject(Object.assign(Error('aborted'),{name:'AbortError'})));
        })
    });
    // Execute real module bodies in one isolated test context, with imports resolved above.
    for (const name of ['i18n','chat','main']) {
        const source = fs.readFileSync(path.join(root,`js/${name}.js`),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
        vm.runInContext(source,context,{filename:`${name}.js`});
    }
    return {document,nodes,requests,context,errors,timers,mediaEvents,documentEvents,storage};
}

(async () => {
    const p = page(), id = key => p.document.getElementById(key), select = s => p.document.querySelector(s);
    assert.equal(p.errors.length,0,'Initialization errors');
    assert.equal(p.requests.length,0);
    assert.equal(id('chat-container').inert,true);
    assert.equal(id('chat-widget').hidden,false);
    assert.equal(select('.theme-toggle').hidden,false);
    assert.equal(select('.lang-toggle').hidden,false);
    assert.equal(p.document.body.classList.contains('navigation-ready'),true);
    const english = p.nodes.filter(n => n.dataset.i18n).map(n => [n,n.dataset.i18nAttr ? n.getAttribute(n.dataset.i18nAttr) : n.textContent]);
    await select('.lang-toggle').emit('click'); assert.equal(p.document.documentElement.lang,'tr');
    await select('.lang-toggle').emit('click'); assert.equal(p.document.documentElement.lang,'en');
    for (const [n,text] of english) assert.equal(n.dataset.i18nAttr ? n.getAttribute(n.dataset.i18nAttr) : n.textContent,text);
    await select('.theme-toggle').emit('click'); assert.equal(p.document.body.classList.contains('light-mode'),true);
    await select('.theme-toggle').emit('click'); assert.equal(p.document.body.classList.contains('light-mode'),false);
    await select('.hamburger').emit('click'); assert.equal(select('.hamburger').getAttribute('aria-expanded'),'true');
    await select('.hamburger').emit('click'); assert.equal(select('.nav-menu').classList.contains('open'),false);
    await select('.hamburger').emit('click'); await select('.nav-link').emit('click');
    assert.equal(select('.hamburger').getAttribute('aria-expanded'),'false');
    await select('.hamburger').emit('click');
    p.documentEvents.keydown.forEach(callback => callback({key:'Escape'}));
    assert.equal(select('.hamburger').getAttribute('aria-expanded'),'false');
    assert.equal(p.document.activeElement,select('.hamburger'));
    await select('.hamburger').emit('click');
    p.mediaEvents.change();
    assert.equal(select('.nav-menu').classList.contains('open'),false);
    await select('.hamburger').emit('click');
    p.documentEvents.click.forEach(callback => callback({target:id('main-content')}));
    assert.equal(select('.nav-menu').classList.contains('open'),false);
    assert.equal(select('.contact-form').events.submit,undefined);
    assert.equal(page('invalid').document.documentElement.lang,'en');
    assert.equal(page('tr').document.documentElement.lang,'tr');
    assert.equal(page('tr',true).errors.length,0,'Storage failure must not break initialization');
    await id('chat-toggle-btn').emit('click'); assert.equal(p.requests.length,0);
    id('chat-input').value = '   ';
    await id('chat-input').emit('keydown',{key:'Enter'});
    id('chat-input').value = 'Composing a question';
    await id('chat-input').emit('keydown',{key:'Enter',isComposing:true});
    assert.equal(p.requests.length,0,'Blank input and IME composition must not send');
    await id('chat-container').emit('keydown',{key:'Escape'});
    assert.equal(p.document.activeElement,id('chat-toggle-btn'));
    assert.equal(id('chat-toggle-btn').getAttribute('aria-expanded'),'false');
    await id('chat-toggle-btn').emit('click');
    id('chat-input').value = '<img src=x onerror=alert(1)> **text**';
    const first = id('chat-send-btn').emit('click');
    assert.equal(p.requests.length,1);
    assert.deepEqual(JSON.parse(p.requests[0].options.body),{message:'<img src=x onerror=alert(1)> **text**',session_id:null});
    assert.equal(id('chat-messages').children.at(-1).children.length,0);
    assert.equal(id('chat-messages').children.at(-1).textContent,'<img src=x onerror=alert(1)> **text**');
    assert.equal(id('chat-input').value,'','Sending clears the input immediately');
    assert.equal(id('chat-input').readOnly,false,'Visitors can compose a new draft while waiting');
    await id('chat-input').emit('input');
    await id('chat-input').emit('keydown',{key:'Enter'}); await id('chat-send-btn').emit('click');
    assert.equal(p.requests.length,1,'Duplicate sends blocked'); assert.equal(id('chat-send-btn').disabled,true);
    await id('chat-close-btn').emit('click');
    p.requests[0].resolve({ok:true,json:async()=>({response:'Answer',session_id:'session-1'})}); await first;
    assert.equal(id('chat-input').value,'','Success must not restore the submitted text');
    assert.equal(p.document.activeElement,id('chat-toggle-btn')); assert.equal(id('chat-container').inert,true);
    await id('chat-toggle-btn').emit('click');
    id('chat-input').value='Next question';
    const second=id('chat-send-btn').emit('click');
    assert.equal(JSON.parse(p.requests[1].options.body).session_id,'session-1');
    p.requests[1].resolve({ok:true,json:async()=>({response:'Next answer',session_id:'session-1'})}); await second;
    assert.equal(id('typing-indicator').classList.contains('active'),false);
    assert.equal(id('chat-send-btn').disabled,true);
    for (const mode of ['network','http','json','empty']) {
        id('chat-input').value=mode; const pending=id('chat-send-btn').emit('click'); const request=p.requests.at(-1);
        if(mode==='network')request.reject(Error('offline'));
        else request.resolve({ok:mode!=='http',json:async()=>{if(mode==='json')throw Error('invalid');return {};}});
        await pending; assert.equal(id('typing-indicator').classList.contains('active'),false);
        assert.equal(id('chat-input').value,mode,'Failed input remains recoverable');
        assert.equal(id('chat-input').readOnly,false);
    }
    for (const invalid of [null, [], {response:'Reply'}, {response:'',session_id:'poisoned'},
            {response:'Reply',session_id:'x'.repeat(129)},
            {response:'x'.repeat(8001),session_id:'poisoned'},
            {agent_response:'Obsolete response',session_id:'poisoned'}]) {
        id('chat-input').value='Recoverable question';
        const pending=id('chat-send-btn').emit('click');
        const request=p.requests.at(-1);
        assert.equal(JSON.parse(request.options.body).session_id,'session-1','Malformed replies must not change the session');
        request.resolve({ok:true,json:async()=>invalid});
        await pending;
        assert.equal(id('chat-input').value,'Recoverable question');
        assert.equal(id('chat-messages').children.at(-1).classList.contains('error'),true);
        assert.equal(id('typing-indicator').classList.contains('active'),false);
    }
    const beforeOversized=p.requests.length;
    assert.equal(id('chat-input').getAttribute('maxlength'),'4000');
    id('chat-input').value='x'.repeat(4001);
    await id('chat-input').emit('input');
    assert.equal(id('chat-send-btn').disabled,true);
    await id('chat-input').emit('keydown',{key:'Enter'});
    await id('chat-send-btn').emit('click');
    assert.equal(p.requests.length,beforeOversized,'Oversized input cannot bypass the button');

    id('chat-input').value='Slow request';
    const slow=id('chat-send-btn').emit('click');
    const requestCount=p.requests.length;
    const timeout=[...p.timers.values()].find(t=>t.delay===90_000);
    assert.ok(timeout);timeout.cb();await slow;
    assert.equal(p.requests.length,requestCount,'Timeout must not retry automatically');
    assert.equal(id('chat-input').value,'Slow request');
    assert.equal(id('chat-input').readOnly,false);
    assert.equal(id('typing-indicator').classList.contains('active'),false);
    assert.equal(p.timers.size,0);

    for (const result of ['success','failure','timeout']) {
        id('chat-input').value='Submitted message';
        const pending=id('chat-send-btn').emit('click');
        const request=p.requests.at(-1), count=p.requests.length;
        assert.equal(id('chat-input').value,'');
        id('chat-input').value='A new draft';
        await id('chat-input').emit('input');
        assert.equal(id('chat-send-btn').disabled,true);
        await id('chat-input').emit('keydown',{key:'Enter'});
        await id('chat-send-btn').emit('click');
        assert.equal(p.requests.length,count,'New draft cannot bypass the in-flight guard');
        if(result==='success')request.resolve({ok:true,json:async()=>({response:'A reply',session_id:'session-1'})});
        if(result==='failure')request.reject(Error('unavailable'));
        if(result==='timeout')[...p.timers.values()].find(t=>t.delay===90_000).cb();
        await pending;
        assert.equal(id('chat-input').value,'A new draft',`${result} must preserve a newer draft`);
        assert.equal(id('chat-send-btn').disabled,false);
        assert.equal(id('typing-indicator').classList.contains('active'),false);
        assert.equal(p.requests.length,count,'Completion must not send the new draft automatically');
    }
    id('chat-input').value='Another submitted message';
    const editedThenCleared=id('chat-send-btn').emit('click');
    id('chat-input').value='A draft I decided to discard';
    await id('chat-input').emit('input');
    id('chat-input').value='';
    await id('chat-input').emit('input');
    p.requests.at(-1).reject(Error('unavailable'));
    await editedThenCleared;
    assert.equal(id('chat-input').value,'','An intentionally discarded new draft must stay empty');
    assert.equal(id('chat-send-btn').disabled,true);

    // Verify our sanitizer boundary and options; this mock does not test DOMPurify itself.
    const unsafeReply = '<img src=x onerror=alert(1)> [link](javascript:alert(1))';
    let sanitizerOptions, parsedInput, sanitizedInput;
    const link = p.document.createElement('a'), code = p.document.createElement('pre');
    const fragment = {
        textContent:'Sanitized content',
        contains:node => node === link || node === code,
        querySelectorAll:selector => selector === 'a[href]' ? [link] : [code]
    };
    p.context.marked = {parse:text => {parsedInput=text; return '<p>Parsed content</p>';}};
    p.context.DOMPurify = {isSupported:true,sanitize:(text,options) => {
        sanitizedInput=text; sanitizerOptions=options; return fragment;
    }};
    async function receiveReply(reply) {
        id('chat-input').value='A real visitor question';
        const pending=id('chat-send-btn').emit('click');
        p.requests.at(-1).resolve({ok:true,json:async()=>({response:reply,session_id:'session-1'})});
        await pending;
        return id('chat-messages').children.at(-1);
    }
    const rendered = await receiveReply(unsafeReply);
    assert.equal(parsedInput,unsafeReply);
    assert.equal(sanitizedInput,'<p>Parsed content</p>');
    assert.equal(rendered.children[0],fragment,'Only sanitized fragments reach the DOM');
    assert.equal(sanitizerOptions.RETURN_DOM_FRAGMENT,true);
    assert.deepEqual(Array.from(sanitizerOptions.ALLOWED_ATTR),['href','title']);
    assert.equal(sanitizerOptions.ALLOW_DATA_ATTR,false);
    assert.equal(sanitizerOptions.ALLOW_ARIA_ATTR,false);
    for (const tag of ['script','style','iframe','svg','math','img','form','input','h1','h2']) {
        assert.equal(sanitizerOptions.ALLOWED_TAGS.includes(tag),false,tag);
    }
    for (const url of ['javascript:alert(1)','data:text/html,test','vbscript:test','//example.com','/relative','java\nscript:test']) {
        assert.equal(sanitizerOptions.ALLOWED_URI_REGEXP.test(url),false,url);
    }
    for (const url of ['https://example.com','http://example.com','mailto:person@example.com']) {
        assert.equal(sanitizerOptions.ALLOWED_URI_REGEXP.test(url),true,url);
    }
    assert.equal(link.getAttribute('target'),'_blank');
    assert.equal(link.getAttribute('rel'),'noopener noreferrer');
    assert.equal(code.getAttribute('tabindex'),'0');
    for (const mode of ['missing','unsupported','sanitizer-error','parser-error']) {
        p.context.marked = {parse:text=>text};
        p.context.DOMPurify = {isSupported:true,sanitize:()=>{throw Error('unavailable');}};
        if(mode==='missing')delete p.context.DOMPurify;
        if(mode==='unsupported')p.context.DOMPurify.isSupported=false;
        if(mode==='parser-error')p.context.marked.parse=()=>{throw Error('parser unavailable');};
        const fallback=await receiveReply(unsafeReply);
        assert.equal(fallback.textContent,unsafeReply,mode);
        assert.equal(fallback.children.length,0,mode);
        assert.equal(fallback.classList.contains('plain-text'),true,mode);
    }
    console.log('PASS: mocked initialization, preferences, EN/TR, menu, native form, chat clearing/draft recovery/concurrency/session/errors/timeout/focus and sanitizer boundary/fallbacks.');
})();
