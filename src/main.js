import './style.scss'

import Draggabilly from 'draggabilly'

const rubbleSymbols = ['📞', '📱', '', '', '✉', '🔿', '✎', '✒', '📎', '', '', '', '➦', '👤', '👥', '', '', '', '', '', '', '➢', '🎯', '', '', '♥', '♡', '★', '☆', '👍', '👎', '', '', '❞', '⌂', '', '🔍', '🔦', '', '🔔', '🔗', '⚑', '⚙', '⚒', '🏆', '', '📷', '📣', '☽', '🎨', '🍂', '♪', '♫', '💥', '🎓', '📕', '📰', '👜', '✈', '', '', '🕔', '🎤', '📅', '⚡', '⛈', '💧', '💿', '💼', '💨', '⏳', '🛇', '🎔', '', '🔑', '🔋', '📾', '', '📽', '☕', '🚀', '', '🛆', '🛈', '🌎', '⌨', '', '', '', '', '', '', '🔅', '🔆', '◑', '', '💻', '∞', '💡', '💳', '📸', '✇', '📋', '', '📦', '🎫', '📶', '💦', '◴', '📊', '🔾', '🔒', '🔓', '⊟', '⊞', '❎', '⊖', '⊕', '✖', '⌫', '', '', '⚠', '🔄', '⟳', '⟲', '🔀', '🔙', '↳', '', '🔁', '', '↰', '⇆', '', '', '⚏', '☰', '📄', '', '', '', '', '🌄', '🎬', '🎵', '📁', '', '', '📤', '📥', '💾', '', '☁', '', '📑', '📖', '▶', '‖', '●', '■', '⏩', '⏪', '', '', '🔊', '🔇', '🕨', '🕩', '🕪', '🕬', '', '', '', '', '', '', '', '']

const tiltAngle = Math.random() * 40 + 50
const tiltDirection = Math.random() < 0.5 ? 1 : -1
document.documentElement.style.setProperty('--head-tilt-angle', `${tiltAngle * tiltDirection}deg`)

window.addEventListener('load', () => {
	document.documentElement.classList.add('is-ready')
})

document.addEventListener('DOMContentLoaded', () => {
	const artHead = document.querySelector('.art-head')
	const tv = document.querySelector('.tv')
	const tvScreen = document.querySelector('.tv__screen')

	const headChange = event => {
		const artHeadRect = artHead.getBoundingClientRect()

		if ((event.clientX > artHeadRect.left && event.clientX < artHeadRect.right) && (event.clientY > artHeadRect.top && event.clientY < artHeadRect.bottom)) {
			artHead.dataset.face = 'center'
			return
		}

		const artHeadCenter = {
			top: artHeadRect.top + (artHeadRect.height / 2),
			left: artHeadRect.left + (artHeadRect.width / 2),
		}

		const angle = Math.atan2(event.clientY - artHeadCenter.top, event.clientX - artHeadCenter.left) * 180 / Math.PI

		if (angle >= -112.5 && angle <= -67.5) {
			artHead.dataset.face = 'up'
		}
		else if (angle >= -22.5 && angle <= 22.5) {
			artHead.dataset.face = 'right'
		}
		else if (angle >= 67.5 && angle <= 112.5) {
			artHead.dataset.face = 'down'
		}
		else if ((angle >= 157.5 && angle <= 180) || (angle >= -180 && angle <= -157.5)) {
			artHead.dataset.face = 'left'
		}
		else {
			artHead.dataset.face = 'center'
		}
	}

	document.addEventListener('mousemove', headChange)

	const draggableHead = new Draggabilly(artHead, {
		containment: '.landscape__sky',
	})

	draggableHead.on('pointerDown', () => {
		artHead.dataset.face = 'ahh'
		tvScreen.dataset.channel = 'maybe'
	})

	draggableHead.on('pointerUp', () => {
		artHead.dataset.face = 'center'
		tvScreen.dataset.channel = 'static'
	})

	draggableHead.on('dragStart', () => {
		document.removeEventListener('mousemove', headChange)
		artHead.dataset.face = 'ahh'
	})

	draggableHead.on('dragEnd', () => {
		artHead.dataset.face = 'ahh'
		tvScreen.dataset.channel = 'eye'

		const tvBottom = parseFloat(window.getComputedStyle(tv).bottom)
		const dropZone = tvBottom * 0.8
		const dropPadding = tvBottom * 0.1
		const artHeadHeight = parseFloat(window.getComputedStyle(artHead).height)

		const headDropFloor = Math.random() * dropZone + dropPadding
		const headDropFloorTop = window.innerHeight - artHeadHeight - headDropFloor

		document.documentElement.style.setProperty('--head-drop-ceiling', `${draggableHead.position.y}px`)
		document.documentElement.style.setProperty('--head-drop-floor', `${headDropFloorTop}px`)

		artHead.classList.add('art-head--dropped')

		const postDrop = event => {
			event.target.removeEventListener(event.type, postDrop)

			tvScreen.dataset.channel = 'static'

			const rubble = document.querySelector('.rubble')
			rubble.style.bottom = `${headDropFloor}px`
			rubble.style.left = window.getComputedStyle(artHead).left

			document.querySelectorAll('.rubble__bit').forEach(rubbleBit => {
				rubbleBit.textContent = rubbleSymbols[Math.floor(Math.random() * rubbleSymbols.length)]

				setTimeout(() => {
					rubbleBit.classList.add('rubble__bit--appeared')
				}, Math.random() * 1000 + 500)
			})

			artHead.classList.add('art-head--faded')

			setTimeout(() => {
				document.querySelector('.dog').classList.add('dog--walked')
			}, 4000)
		}

		artHead.addEventListener('animationend', postDrop)
	})
})

