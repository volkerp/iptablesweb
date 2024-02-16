
export function tooltip(node, params) {
	node.classList.add('tooltip');
	node.setAttribute('tabindex', 0);
	
	function handleFocus() {
		const child = document.createElement('div');
		child.innerHTML = params;
		child.setAttribute('id', 'tooltip');
		node.appendChild(child);
		
		node.addEventListener('mouseleave', handleBlur)
		node.addEventListener('blur', handleBlur)
		node.removeEventListener('mouseenter', handleFocus)
		node.removeEventListener('focus', handleFocus)
	}

	function handleBlur() {
		node.removeChild(node.querySelector('#tooltip'));
		
		node.removeEventListener('mouseleave', handleBlur)
		node.removeEventListener('blur', handleBlur)
		node.addEventListener('mouseenter', handleFocus)
		node.addEventListener('focus', handleFocus)
	}
	
	node.addEventListener('mouseenter', handleFocus)
	node.addEventListener('focus', handleFocus)
	
	return {
		destroy() {
			node.classList.remove('tooltip');
			node.removeEventListener('mouseenter', handleFocus)
			node.removeEventListener('focus', handleFocus)
		}
	}
}

const style = document.createElement('style');
style.textContent = `
	.tooltip {
		white-space: nowrap;
		position: relative;
		padding-top: 0.35rem;
		cursor: zoom-in;
		border-bottom: 1px solid currentColor;
	}
	
	.tooltip::after {
		margin: 0 0.15rem 0 0.25rem;
		content: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="-50 -50 100 100"%3E%3Cg fill="none" stroke="hsl(0, 0%25, 30%25)" stroke-linecap="round"%3E%3Cpath stroke-width="8" d="M -13 -13 m 0 -10 v 20 m 10 -10 h -20" /%3E%3Cg stroke-width="14"%3E%3Ccircle r="30" cx="-13" cy="-13" /%3E%3Cpath d="M 24 24 l 18 18" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
	}
	
	#tooltip {
		position: absolute;
		bottom: 100%;
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: hsl(0, 0%, 20%);
		color: hsl(0, 0%, 98%);
		font-size: 0.95em;
		border-radius: 0.25rem;
		filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
		width: max-content;
	}
	
	.tooltip:not(:focus) #tooltip::before {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0.6em;
		height: 0.25em;
		background: inherit;
		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
	}
`;