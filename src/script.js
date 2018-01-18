import './index.html'
import './style.scss'
import './favicon.png'

import Draggabilly from 'draggabilly'

// Entypo symbols
const rubbleSymbols = ['📞', '📱', '', '', '✉', '🔿', '✎', '✒', '📎', '', '', '', '➦', '👤', '👥', '', '', '', '', '', '', '➢', '🎯', '', '', '♥', '♡', '★', '☆', '👍', '👎', '', '', '❞', '⌂', '', '🔍', '🔦', '', '🔔', '🔗', '⚑', '⚙', '⚒', '🏆', '', '📷', '📣', '☽', '🎨', '🍂', '♪', '♫', '💥', '🎓', '📕', '📰', '👜', '✈', '', '', '🕔', '🎤', '📅', '⚡', '⛈', '💧', '💿', '💼', '💨', '⏳', '🛇', '🎔', '', '🔑', '🔋', '📾', '', '📽', '☕', '🚀', '', '🛆', '🛈', '🌎', '⌨', '', '', '', '', '', '', '🔅', '🔆', '◑', '', '💻', '∞', '💡', '💳', '📸', '✇', '📋', '', '📦', '🎫', '📶', '💦', '◴', '📊', '🔾', '🔒', '🔓', '⊟', '⊞', '❎', '⊖', '⊕', '✖', '⌫', '', '', '⚠', '🔄', '⟳', '⟲', '🔀', '🔙', '↳', '', '🔁', '', '↰', '⇆', '', '', '⚏', '☰', '📄', '', '', '', '', '🌄', '🎬', '🎵', '📁', '', '', '📤', '📥', '💾', '', '☁', '', '📑', '📖', '▶', '‖', '●', '■', '⏩', '⏪', '', '', '🔊', '🔇', '🕨', '🕩', '🕪', '🕬', '', '', '', '', '', '', '', '']

// Set a random tilt angle for dropped head
const tiltAngle = Math.random() * 40 + 50
const tiltDirection = Math.random() < 0.5 ? 1 : -1
document.documentElement.style.setProperty('--head-tilt-angle', `${tiltAngle * tiltDirection}deg`)

// DOM init
document.addEventListener('DOMContentLoaded', () => {
	let artHead = document.querySelector('.art-head')
	let tv = document.querySelector('.tv')
	let tvScreen = document.querySelector('.tv__screen')

	// Change head depending on mouse position
	let headChange = event => {
		// Determine head rect and center coords
		let artHeadRect = artHead.getBoundingClientRect()

		// If hovering the head, center the face
		if ((event.clientX > artHeadRect.left && event.clientX < artHeadRect.right) && (event.clientY > artHeadRect.top && event.clientY < artHeadRect.bottom)) {
			artHead.dataset.face = 'center'
			return
		}

		// Center of head
		let artHeadCenter = {
			top: artHeadRect.top + (artHeadRect.height / 2),
			left: artHeadRect.left + (artHeadRect.width / 2),
		}

		// Determine degree angle of mouse compared to center of head
		let angle = Math.atan2(event.clientY - artHeadCenter.top, event.clientX - artHeadCenter.left) * 180 / Math.PI

		// Set face depending on angle
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

	// On mousemove, set appropriate face
	document.addEventListener('mousemove', headChange)

	let draggableHead = new Draggabilly(artHead, {
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

	// Destroy the head change listener when the user starts dragging
	draggableHead.on('dragStart', () => {
		document.removeEventListener('mousemove', headChange)
		artHead.dataset.face = 'ahh'
	})

	draggableHead.on('dragEnd', () => {
		artHead.dataset.face = 'ahh' // Set here again to disrupt pointerUp event
		tvScreen.dataset.channel = 'eye'

		// Determine random space in front of TV to which the head will drop
		const tvBottom = parseFloat(window.getComputedStyle(tv).bottom) // The space between the TV and the bottom of the screen
		const dropZone = tvBottom * 0.8 // The area in which the head will be allowed to drop
		const dropPadding = tvBottom * 0.1 // Padding from the bottom of the screen
		const artHeadHeight = parseFloat(window.getComputedStyle(artHead).height)

		const headDropFloor = Math.random() * dropZone + dropPadding // Random area in dropZone, the desired offset from the bottom
		const headDropFloorTop = window.innerHeight - artHeadHeight - headDropFloor // The CSS top position for head to reach floor

		// Set head start and end drop positions for CSS
		document.documentElement.style.setProperty('--head-drop-ceiling', `${draggableHead.position.y}px`)
		document.documentElement.style.setProperty('--head-drop-floor', `${headDropFloorTop}px`)

		artHead.classList.add('art-head--dropped')

		// Logic to run after head has dropped
		let postDrop = event => {
			// Remove listener so that postDrop only runs once
			event.target.removeEventListener(event.type, postDrop)

			tvScreen.dataset.channel = 'static'

			let rubble = document.querySelector('.rubble')
			rubble.style.bottom = `${headDropFloor}px` // Set bottom instead of top to stick rubble to ground on resize
			rubble.style.left = window.getComputedStyle(artHead).left

			// Set a random symbol and fade-in delay for each piece of rubble
			document.querySelectorAll('.rubble__bit').forEach(rubbleBit => {
				rubbleBit.textContent = rubbleSymbols[Math.floor(Math.random() * rubbleSymbols.length)]

				setTimeout(() => {
					rubbleBit.classList.add('rubble__bit--appeared')
				}, Math.random() * 1000 + 500) // Random time between 0.5–1.5s
			})

			// Fade out head
			artHead.classList.add('art-head--faded')

			// Start walking dog after 4 seconds
			setTimeout(() => {
				document.querySelector('.dog').classList.add('dog--walked')
			}, 4000)
		}

		// Run follow-on function at the end of the CSS transition
		artHead.addEventListener('animationend', postDrop)
	})
})