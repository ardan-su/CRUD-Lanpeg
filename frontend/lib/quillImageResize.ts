/**
 * Custom Quill Image Resize Module v3
 * 
 * When user clicks an image in the editor, shows a floating toolbar with:
 * - Size presets: Small (25%), Medium (50%), Large (75%), Full (100%)
 * - Alignment: Left, Center, Right
 * - Wrap: Wrap Left (float left), Wrap Right (float right), No Wrap
 */
import ReactQuill from 'react-quill';

const Quill = ReactQuill.Quill;
const BlockEmbed = Quill.import('blots/block/embed') as any;
const Parchment = Quill.import('parchment') as any;

// --- Custom Image Blot ---
// Preserves width, height, style, class, and data-align/data-wrap attributes
class ResizableImageBlot extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'IMG';

    static create(value: any) {
        const node = super.create() as HTMLElement;
        if (typeof value === 'string') {
            node.setAttribute('src', value);
        } else {
            node.setAttribute('src', value.src || value.url || '');
            if (value.width) node.setAttribute('width', value.width);
            if (value.height) node.setAttribute('height', value.height);
            if (value.alt) node.setAttribute('alt', value.alt);
            if (value.style) node.setAttribute('style', value.style);
            if (value['data-size']) node.setAttribute('data-size', value['data-size']);
            if (value['data-align']) node.setAttribute('data-align', value['data-align']);
            if (value['data-wrap']) node.setAttribute('data-wrap', value['data-wrap']);
        }
        return node;
    }

    static value(node: HTMLElement) {
        const src = node.getAttribute('src') || '';
        const width = node.getAttribute('width');
        const height = node.getAttribute('height');
        const style = node.getAttribute('style');
        const alt = node.getAttribute('alt');
        const dataSize = node.getAttribute('data-size');
        const dataAlign = node.getAttribute('data-align');
        const dataWrap = node.getAttribute('data-wrap');

        if (!width && !height && !style && !dataSize && !dataAlign && !dataWrap) {
            return src;
        }

        return {
            src,
            ...(width && { width }),
            ...(height && { height }),
            ...(style && { style }),
            ...(alt && { alt }),
            ...(dataSize && { 'data-size': dataSize }),
            ...(dataAlign && { 'data-align': dataAlign }),
            ...(dataWrap && { 'data-wrap': dataWrap }),
        };
    }

    static formats(node: HTMLElement) {
        const formats: any = {};
        if (node.hasAttribute('width')) formats.width = node.getAttribute('width');
        if (node.hasAttribute('height')) formats.height = node.getAttribute('height');
        if (node.hasAttribute('style')) formats.style = node.getAttribute('style');
        if (node.hasAttribute('alt')) formats.alt = node.getAttribute('alt');
        if (node.hasAttribute('data-size')) formats['data-size'] = node.getAttribute('data-size');
        if (node.hasAttribute('data-align')) formats['data-align'] = node.getAttribute('data-align');
        if (node.hasAttribute('data-wrap')) formats['data-wrap'] = node.getAttribute('data-wrap');
        return formats;
    }

    format(name: string, value: any) {
        if (['width', 'height', 'style', 'alt', 'data-size', 'data-align', 'data-wrap'].includes(name)) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}

// --- Size/Alignment/Wrap Toolbar Module ---
const SIZE_OPTIONS = [
    { label: 'S', title: 'Small (25%)', value: '25' },
    { label: 'M', title: 'Medium (50%)', value: '50' },
    { label: 'L', title: 'Large (75%)', value: '75' },
    { label: '100%', title: 'Full Width', value: '100' },
];

const ALIGN_OPTIONS = [
    { label: '⫷', title: 'Rata Kiri', value: 'left' },
    { label: '⟐', title: 'Tengah', value: 'center' },
    { label: '⫸', title: 'Rata Kanan', value: 'right' },
];

const WRAP_OPTIONS = [
    { label: '↰', title: 'Wrap Kiri (teks di kanan)', value: 'left' },
    { label: '↱', title: 'Wrap Kanan (teks di kiri)', value: 'right' },
    { label: '☐', title: 'Tanpa Wrap', value: 'none' },
];

class ImageResize {
    quill: any;
    options: any;
    currentImg: HTMLImageElement | null = null;
    toolbar: HTMLDivElement | null = null;
    overlay: HTMLDivElement | null = null;

    constructor(quill: any, options: any = {}) {
        this.quill = quill;
        this.options = options;

        this.quill.root.addEventListener('click', this.handleClick.bind(this));
        this.quill.on('text-change', this.hide.bind(this));
        document.addEventListener('click', this.handleDocClick.bind(this));
        window.addEventListener('resize', this.repositionToolbar.bind(this));
    }

    handleDocClick(e: MouseEvent) {
        if (!this.currentImg) return;
        // If click is outside quill editor, hide
        if (!this.quill.root.contains(e.target as Node) &&
            !(this.toolbar && this.toolbar.contains(e.target as Node))) {
            this.hide();
        }
    }

    handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (target && target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            if (this.currentImg === target) return;
            this.hide();
            this.show(target as HTMLImageElement);
        } else {
            this.hide();
        }
    }

    show(img: HTMLImageElement) {
        this.currentImg = img;
        this.createOverlay();
        this.createToolbar();
        this.positionAll();
    }

    hide() {
        if (this.toolbar) {
            this.toolbar.remove();
            this.toolbar = null;
        }
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        this.currentImg = null;
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute',
            border: '2px solid #5D0E6D',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: '10',
            borderRadius: '4px',
        });
        this.quill.root.parentNode.appendChild(this.overlay);
    }

    createToolbar() {
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, {
            position: 'absolute',
            display: 'flex',
            gap: '2px',
            background: '#1a1a2e',
            borderRadius: '8px',
            padding: '4px',
            zIndex: '11',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '420px',
        });

        // Current state
        const currentSize = this.currentImg?.getAttribute('data-size') || '';
        const currentAlign = this.currentImg?.getAttribute('data-align') || '';
        const currentWrap = this.currentImg?.getAttribute('data-wrap') || '';
        const isWrapped = currentWrap === 'left' || currentWrap === 'right';

        // Size buttons
        SIZE_OPTIONS.forEach((opt) => {
            const btn = this.makeButton(opt.label, opt.title, currentSize === opt.value);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.applySize(opt.value);
            });
            this.toolbar!.appendChild(btn);
        });

        // Separator
        this.toolbar!.appendChild(this.makeSeparator());

        // Alignment buttons (disabled visual if wrapped)
        ALIGN_OPTIONS.forEach((opt) => {
            const isActive = !isWrapped && currentAlign === opt.value;
            const btn = this.makeButton(opt.label, opt.title, isActive, isWrapped);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isWrapped) {
                    this.applyAlign(opt.value);
                }
            });
            this.toolbar!.appendChild(btn);
        });

        // Separator
        this.toolbar!.appendChild(this.makeSeparator());

        // Wrap buttons
        WRAP_OPTIONS.forEach((opt) => {
            const isActive = opt.value === 'none' ? !isWrapped : currentWrap === opt.value;
            const btn = this.makeButton(opt.label, opt.title, isActive);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.applyWrap(opt.value);
            });
            this.toolbar!.appendChild(btn);
        });

        this.quill.root.parentNode.appendChild(this.toolbar);
    }

    makeSeparator(): HTMLDivElement {
        const sep = document.createElement('div');
        Object.assign(sep.style, {
            width: '1px',
            background: 'rgba(255,255,255,0.2)',
            margin: '2px 4px',
        });
        return sep;
    }

    makeButton(label: string, title: string, active: boolean, disabled: boolean = false): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.title = title;
        btn.type = 'button';
        Object.assign(btn.style, {
            background: active ? '#5D0E6D' : 'transparent',
            color: disabled ? 'rgba(255,255,255,0.3)' : 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            minWidth: '36px',
            transition: 'all 0.15s ease',
            opacity: disabled ? '0.4' : '1',
        });
        if (!disabled) {
            btn.addEventListener('mouseenter', () => {
                if (!active) btn.style.background = 'rgba(255,255,255,0.15)';
            });
            btn.addEventListener('mouseleave', () => {
                if (!active) btn.style.background = 'transparent';
            });
        }
        return btn;
    }

    applySize(sizePercent: string) {
        if (!this.currentImg) return;

        const pct = parseInt(sizePercent);
        const currentWrap = this.currentImg.getAttribute('data-wrap') || '';
        const currentAlign = this.currentImg.getAttribute('data-align') || 'center';
        const isWrapped = currentWrap === 'left' || currentWrap === 'right';

        // Build style based on whether wrap is active
        const style = isWrapped
            ? this.buildWrapStyle(pct, currentWrap)
            : this.buildStyle(pct, currentAlign);

        this.currentImg.setAttribute('data-size', sizePercent);
        this.currentImg.setAttribute('style', style);
        this.currentImg.removeAttribute('width');
        this.currentImg.removeAttribute('height');

        // Update blot
        const blot = Quill.find(this.currentImg);
        if (blot) {
            blot.format('style', style);
            blot.format('data-size', sizePercent);
            blot.format('width', null);
            blot.format('height', null);
        }

        this.quill.update('user');
        this.hide();
    }

    applyAlign(align: string) {
        if (!this.currentImg) return;

        const currentSize = this.currentImg.getAttribute('data-size') || '100';
        const pct = parseInt(currentSize);

        const style = this.buildStyle(pct, align);

        this.currentImg.setAttribute('data-align', align);
        this.currentImg.setAttribute('style', style);
        // Clear wrap when applying alignment
        this.currentImg.removeAttribute('data-wrap');

        const blot = Quill.find(this.currentImg);
        if (blot) {
            blot.format('style', style);
            blot.format('data-align', align);
            blot.format('data-wrap', null);
        }

        this.quill.update('user');
        this.hide();
    }

    applyWrap(wrap: string) {
        if (!this.currentImg) return;

        const currentSize = this.currentImg.getAttribute('data-size') || '50';
        const pct = parseInt(currentSize);

        if (wrap === 'none') {
            // Remove wrap, revert to block alignment
            const currentAlign = this.currentImg.getAttribute('data-align') || 'center';
            const style = this.buildStyle(pct, currentAlign);

            this.currentImg.setAttribute('style', style);
            this.currentImg.removeAttribute('data-wrap');

            const blot = Quill.find(this.currentImg);
            if (blot) {
                blot.format('style', style);
                blot.format('data-wrap', null);
            }
        } else {
            // Apply float wrap
            // If size is 100%, reduce to 50% to make wrap useful
            const effectivePct = pct >= 100 ? 50 : pct;
            const style = this.buildWrapStyle(effectivePct, wrap);

            this.currentImg.setAttribute('data-wrap', wrap);
            this.currentImg.setAttribute('data-size', String(effectivePct));
            this.currentImg.setAttribute('style', style);
            // Clear alignment when wrapping
            this.currentImg.removeAttribute('data-align');

            const blot = Quill.find(this.currentImg);
            if (blot) {
                blot.format('style', style);
                blot.format('data-wrap', wrap);
                blot.format('data-size', String(effectivePct));
                blot.format('data-align', null);
            }
        }

        this.quill.update('user');
        this.hide();
    }

    buildStyle(pct: number, align: string): string {
        const parts: string[] = [];
        parts.push(`width: ${pct}%`);
        parts.push('height: auto');

        if (align === 'center') {
            parts.push('display: block');
            parts.push('margin-left: auto');
            parts.push('margin-right: auto');
        } else if (align === 'right') {
            parts.push('display: block');
            parts.push('margin-left: auto');
            parts.push('margin-right: 0');
        } else {
            // left
            parts.push('display: block');
            parts.push('margin-left: 0');
            parts.push('margin-right: auto');
        }

        return parts.join('; ') + ';';
    }

    buildWrapStyle(pct: number, floatDir: string): string {
        const parts: string[] = [];
        parts.push(`width: ${pct}%`);
        parts.push('height: auto');
        parts.push(`float: ${floatDir}`);

        if (floatDir === 'left') {
            parts.push('margin: 0 16px 12px 0');
        } else {
            parts.push('margin: 0 0 12px 16px');
        }

        parts.push('border-radius: 8px');

        return parts.join('; ') + ';';
    }

    positionAll() {
        if (!this.currentImg) return;

        const parent = this.quill.root.parentNode;
        const imgRect = this.currentImg.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();

        const left = imgRect.left - parentRect.left + parent.scrollLeft;
        const top = imgRect.top - parentRect.top + parent.scrollTop;
        const width = imgRect.width;
        const height = imgRect.height;

        // Position overlay
        if (this.overlay) {
            Object.assign(this.overlay.style, {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
            });
        }

        // Position toolbar above image
        if (this.toolbar) {
            const toolbarHeight = 40;
            const toolbarTop = top - toolbarHeight - 8;

            Object.assign(this.toolbar.style, {
                left: `${left + width / 2}px`,
                top: `${toolbarTop > 0 ? toolbarTop : top + height + 8}px`,
                transform: 'translateX(-50%)',
            });
        }
    }

    repositionToolbar() {
        if (this.currentImg) this.positionAll();
    }
}

// --- Registration ---
export function registerImageResize() {
    Quill.register(ResizableImageBlot, true);
    Quill.register('modules/imageResize', ImageResize);
}

export { ResizableImageBlot, ImageResize };
