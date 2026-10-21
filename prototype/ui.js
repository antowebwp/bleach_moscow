'use strict'
const menu = document.querySelector('#mobile-menu'),
	menuToggle = document.querySelector('.menu-toggle')
const reducedUI = matchMedia('(prefers-reduced-motion: reduce)')
let menuAnimation,
	menuIsOpen = false
function setMenuOpen(open) {
	menuIsOpen = open
	menuToggle.setAttribute('aria-expanded', String(open))
	menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню')
	const current = menu.hidden
		? { transform: 'translateX(100%)' }
		: { transform: getComputedStyle(menu).transform }
	menuAnimation?.cancel()
	menu.hidden = false
	menu.inert = !open
	if (reducedUI.matches) {
		menu.hidden = !open
		return
	}
	const animation = menu.animate(
		[current, { transform: open ? 'translateX(0)' : 'translateX(100%)' }],
		{
			duration: open ? 1350 : 1000,
			easing: 'cubic-bezier(.22,1,.36,1)',
			fill: 'both',
		},
	)
	menuAnimation = animation
	animation.finished
		.then(() => {
			if (menuAnimation !== animation) return
			menu.hidden = !menuIsOpen
			animation.cancel()
			menuAnimation = null
		})
		.catch(() => {})
}
function closeMenu() {
	if (menuIsOpen) setMenuOpen(false)
}
menuToggle.addEventListener('click', () => setMenuOpen(!menuIsOpen))
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu))
document.addEventListener('keydown', e => {
	if (e.key === 'Escape' && !menu.hidden) {
		closeMenu()
		menuToggle.focus()
	}
})
document.addEventListener('click', e => {
	if (
		!menu.hidden &&
		!menu.contains(e.target) &&
		!menuToggle.contains(e.target)
	)
		closeMenu()
})
matchMedia('(min-width:1181px)').addEventListener('change', e => {
	if (e.matches) closeMenu()
})
const contactDialog = document.querySelector('#contact-dialog')
document.querySelectorAll('[data-contact]').forEach(button =>
	button.addEventListener('click', () => {
		closeMenu()
		const courier = button.dataset.contact === 'courier'
		document.querySelector('#dialog-title').textContent = courier
			? 'Вызвать курьера'
			: 'Бесплатная консультация'
		document.querySelector('#dialog-description').textContent = courier
			? 'Свяжитесь с мастерской, чтобы согласовать адрес и время бесплатной доставки в пределах МКАД.'
			: 'Отправьте фотографию изделия для предварительной оценки.'
		if (button.dataset.service) {
			document.querySelector('#dialog-title').textContent = button.dataset.service
		}
		contactDialog.showModal()
	}),
)
document.querySelectorAll('dialog').forEach(dialog => {
	dialog
		.querySelector('.dialog-close')
		.addEventListener('click', () => dialog.close())
	dialog.addEventListener('click', e => {
		const r = dialog.getBoundingClientRect()
		if (
			e.target === dialog &&
			(e.clientX < r.left ||
				e.clientX > r.right ||
				e.clientY < r.top ||
				e.clientY > r.bottom)
		)
			dialog.close()
	})
})
const cookie = document.querySelector('.cookie')
try {
	cookie.hidden = localStorage.getItem('cookiesAccepted') === 'true'
} catch {
	cookie.hidden = false
}
document.querySelector('#cookie-accept').addEventListener('click', () => {
	cookie.hidden = true
	try {
		localStorage.setItem('cookiesAccepted', 'true')
	} catch {}
})

// Progressive enhancement: native details remain readable in server-rendered ACF markup.
const disclosures = new WeakMap()
let disclosureRefresh
function refreshDisclosureLayout() {
	cancelAnimationFrame(disclosureRefresh)
	disclosureRefresh = requestAnimationFrame(() =>
		window.ScrollTrigger?.refresh(true),
	)
}
function setDisclosureOpen(detail, open) {
	const state = disclosures.get(detail)
	if (!state || state.expanded === open) return
	if (open && state.group) {
		document.querySelectorAll('details').forEach(other => {
			const sibling = disclosures.get(other)
			if (other !== detail && sibling?.group === state.group)
				setDisclosureOpen(other, false)
		})
	}
	const from = detail.getBoundingClientRect().height
	state.animation?.cancel()
	state.expanded = open
	detail.dataset.expanded = String(open)
	state.summary.setAttribute('aria-expanded', String(open))
	if (!open && state.body.contains(document.activeElement))
		state.summary.focus()
	state.body.inert = !open
	detail.open = true
	detail.style.height = 'auto'
	const to = open
		? detail.getBoundingClientRect().height
		: state.summary.getBoundingClientRect().height +
			parseFloat(getComputedStyle(detail).borderTopWidth) +
			parseFloat(getComputedStyle(detail).borderBottomWidth)
	const finish = () => {
		detail.open = state.expanded
		detail.style.removeProperty('height')
		detail.style.removeProperty('overflow')
		state.animation = null
		detail.dispatchEvent(new CustomEvent('disclosure:settled'))
		refreshDisclosureLayout()
	}
	detail.dispatchEvent(
		new CustomEvent('disclosure:change', { detail: { open } }),
	)
	if (reducedUI.matches) {
		finish()
		return
	}
	detail.style.overflow = 'hidden'
	const animation = detail.animate(
		[{ height: from + 'px' }, { height: to + 'px' }],
		{ duration: 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
	)
	state.animation = animation
	animation.finished
		.then(() => {
			if (state.animation !== animation) return
			finish()
			animation.cancel()
		})
		.catch(() => {})
}
document.querySelectorAll('details').forEach((detail, index) => {
	const summary = detail.querySelector(':scope > summary')
	if (!summary) return
	const body = document.createElement('div')
	body.className = 'disclosure-content'
	body.id = 'disclosure-content-' + index
	;[...detail.childNodes]
		.filter(node => node !== summary)
		.forEach(node => body.append(node))
	detail.append(body)
	const state = {
		summary,
		body,
		group: detail.getAttribute('name'),
		expanded: detail.open,
		animation: null,
	}
	disclosures.set(detail, state)
	// Native exclusivity hides outgoing content instantly; enhanced groups animate both panels.
	detail.removeAttribute('name')
	detail.dataset.expanded = String(detail.open)
	summary.setAttribute('aria-controls', body.id)
	summary.setAttribute('aria-expanded', String(detail.open))
	body.inert = !detail.open
	summary.addEventListener('click', event => {
		event.preventDefault()
		setDisclosureOpen(detail, !state.expanded)
	})
})
window.addEventListener('resize', () => {
	document.querySelectorAll('details').forEach(detail => {
		const state = disclosures.get(detail)
		if (!state?.animation) return
		state.animation.cancel()
		state.animation = null
		detail.open = state.expanded
		detail.style.removeProperty('height')
		detail.style.removeProperty('overflow')
	})
})
document.querySelectorAll('img').forEach(img => (img.draggable = false))
document.addEventListener('dragstart', event => {
	if (event.target instanceof HTMLImageElement) event.preventDefault()
})
