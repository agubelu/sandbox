let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*/
export const ParticleKind = Object.freeze({ Empty:0,"0":"Empty",Sand:1,"1":"Sand",Wall:2,"2":"Wall",Water:3,"3":"Water", });

const BrushFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_brush_free(ptr >>> 0, 1));
/**
*/
export class Brush {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrushFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_brush_free(ptr, 0);
    }
    /**
    * @param {number} max_x
    * @param {number} max_y
    * @param {number} radius
    * @param {number} chance
    */
    constructor(max_x, max_y, radius, chance) {
        const ret = wasm.brush_new(max_x, max_y, radius, chance);
        this.__wbg_ptr = ret >>> 0;
        BrushFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {(Coord)[]}
    */
    stroke(x, y) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.brush_stroke(retptr, this.__wbg_ptr, x, y);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const ColorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_color_free(ptr >>> 0, 1));
/**
*/
export class Color {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Color.prototype);
        obj.__wbg_ptr = ptr;
        ColorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ColorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_color_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get r() {
        const ret = wasm.__wbg_get_color_r(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set r(arg0) {
        wasm.__wbg_set_color_r(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get g() {
        const ret = wasm.__wbg_get_color_g(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set g(arg0) {
        wasm.__wbg_set_color_g(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get b() {
        const ret = wasm.__wbg_get_color_b(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set b(arg0) {
        wasm.__wbg_set_color_b(this.__wbg_ptr, arg0);
    }
}

const CoordFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_coord_free(ptr >>> 0, 1));
/**
*/
export class Coord {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Coord.prototype);
        obj.__wbg_ptr = ptr;
        CoordFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CoordFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_coord_free(ptr, 0);
    }
    /**
    * @returns {number}
    */
    get 0() {
        const ret = wasm.__wbg_get_coord_0(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set 0(arg0) {
        wasm.__wbg_set_coord_0(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get 1() {
        const ret = wasm.__wbg_get_coord_1(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set 1(arg0) {
        wasm.__wbg_set_coord_1(this.__wbg_ptr, arg0);
    }
}

const ParticleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_particle_free(ptr >>> 0, 1));
/**
*/
export class Particle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Particle.prototype);
        obj.__wbg_ptr = ptr;
        ParticleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particle_free(ptr, 0);
    }
    /**
    * @returns {ParticleKind}
    */
    get kind() {
        const ret = wasm.__wbg_get_particle_kind(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {ParticleKind} arg0
    */
    set kind(arg0) {
        wasm.__wbg_set_particle_kind(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {Color}
    */
    get color() {
        const ret = wasm.__wbg_get_particle_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
    * @param {Color} arg0
    */
    set color(arg0) {
        _assertClass(arg0, Color);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_particle_color(this.__wbg_ptr, ptr0);
    }
    /**
    * @param {ParticleKind} kind
    */
    constructor(kind) {
        const ret = wasm.particle_new(kind);
        this.__wbg_ptr = ret >>> 0;
        ParticleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * @returns {Particle}
    */
    static empty() {
        const ret = wasm.particle_empty();
        return Particle.__wrap(ret);
    }
    /**
    * Asks the particle to update its position based on its current position and the world information.
    * If the particle wants to move, returns `Some(new_position)``.
    * @param {number} pos
    * @param {Sandbox} world
    * @returns {number | undefined}
    */
    update(pos, world) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(world, Sandbox);
            wasm.particle_update(retptr, this.__wbg_ptr, pos, world.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            return r0 === 0 ? undefined : r1 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const SandboxFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sandbox_free(ptr >>> 0, 1));
/**
*/
export class Sandbox {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SandboxFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sandbox_free(ptr, 0);
    }
    /**
    * @param {number} width
    * @param {number} height
    */
    constructor(width, height) {
        const ret = wasm.sandbox_new(width, height);
        this.__wbg_ptr = ret >>> 0;
        SandboxFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * Returns the particle type in a provided index. Panics if the index is OOB.
    * @param {number} ix
    * @returns {ParticleKind}
    */
    particle_type_at(ix) {
        const ret = wasm.sandbox_particle_type_at(this.__wbg_ptr, ix);
        return ret;
    }
    /**
    * Adds a new particle to the world. Panics if the specified position is OOB.
    * @param {number} x
    * @param {number} y
    * @param {ParticleKind} kind
    */
    set_particle(x, y, kind) {
        wasm.sandbox_set_particle(this.__wbg_ptr, x, y, kind);
    }
    /**
    * Advances the world forward a single step. Returns a list with the index of all particles that have changed.
    * @param {Uint8Array} canvas
    * @returns {boolean}
    */
    update(canvas) {
        var ptr0 = passArray8ToWasm0(canvas, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.sandbox_update(this.__wbg_ptr, ptr0, len0, addHeapObject(canvas));
        return ret !== 0;
    }
    /**
    */
    clear() {
        wasm.sandbox_clear(this.__wbg_ptr);
    }
    /**
    * @returns {number}
    */
    width() {
        const ret = wasm.sandbox_width(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height() {
        const ret = wasm.sandbox_height(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Whether the provided index is in the first (top-most) row of the world.
    * Whether the provided index is in the last (bottom-most) row of the world.
    * @param {number} ix
    * @returns {boolean}
    */
    is_bottom_row(ix) {
        const ret = wasm.sandbox_is_bottom_row(this.__wbg_ptr, ix);
        return ret !== 0;
    }
    /**
    * Whether the provided index is in the first (left-most) column of the world.
    * @param {number} ix
    * @returns {boolean}
    */
    is_left_col(ix) {
        const ret = wasm.sandbox_is_left_col(this.__wbg_ptr, ix);
        return ret !== 0;
    }
    /**
    * Whether the provided index is in the last (right-most) column of the world.
    * @param {number} ix
    * @returns {boolean}
    */
    is_right_col(ix) {
        const ret = wasm.sandbox_is_right_col(this.__wbg_ptr, ix);
        return ret !== 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_coord_new = function(arg0) {
        const ret = Coord.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_3093d5d1f7bcb682 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_3bcfc4d31bc012f8 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_globalThis_86b222e13bdf32ed = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_e5a3fe56f8be9485 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_76313bd6ff35d0f2 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_1084a111329e68ce = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_89af060b4e1523f2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbg_process_4a72847cc503995b = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_f686565e586dd935 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_ec548f448387c968 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_buffer_b7b08af79b0b0974 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_8a2cb9ca96b27ec9 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_subarray_7c2e3576afe181d1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_new_ea1883e1e5e86686 = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_d1e79e2388520f18 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
        new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;



    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined' && Object.getPrototypeOf(module) === Object.prototype)
    ({module} = module)
    else
    console.warn('using deprecated parameters for `initSync()`; pass a single object instead')

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined' && Object.getPrototypeOf(module_or_path) === Object.prototype)
    ({module_or_path} = module_or_path)
    else
    console.warn('using deprecated parameters for the initialization function; pass a single object instead')

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('sandbox_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
