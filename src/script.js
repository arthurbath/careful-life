import html from './index.html' // eslint-disable-line no-unused-vars
import css from './style.scss' // eslint-disable-line no-unused-vars
import favicon from './favicon.png' // eslint-disable-line no-unused-vars

import Draggabilly from 'draggabilly'

// Entypo symbols
const rubbleSymbols = ['📞', '📱', '', '', '✉', '🔿', '✎', '✒', '📎', '', '', '', '➦', '👤', '👥', '', '', '', '', '', '', '➢', '🎯', '', '', '♥', '♡', '★', '☆', '👍', '👎', '', '', '❞', '⌂', '', '🔍', '🔦', '', '🔔', '🔗', '⚑', '⚙', '⚒', '🏆', '', '📷', '📣', '☽', '🎨', '🍂', '♪', '♫', '💥', '🎓', '📕', '📰', '👜', '✈', '', '', '🕔', '🎤', '📅', '⚡', '⛈', '💧', '💿', '💼', '💨', '⏳', '🛇', '🎔', '', '🔑', '🔋', '📾', '', '📽', '☕', '🚀', '', '🛆', '🛈', '🌎', '⌨', '', '', '', '', '', '', '🔅', '🔆', '◑', '', '💻', '∞', '💡', '💳', '📸', '✇', '📋', '', '📦', '🎫', '📶', '💦', '◴', '📊', '🔾', '🔒', '🔓', '⊟', '⊞', '❎', '⊖', '⊕', '✖', '⌫', '', '', '⚠', '🔄', '⟳', '⟲', '🔀', '🔙', '↳', '', '🔁', '', '↰', '⇆', '', '', '⚏', '☰', '📄', '', '', '', '', '🌄', '🎬', '🎵', '📁', '', '', '📤', '📥', '💾', '', '☁', '', '📑', '📖', '▶', '‖', '●', '■', '⏩', '⏪', '', '', '🔊', '🔇', '🕨', '🕩', '🕪', '🕬', '', '', '', '', '', '', '', '']

// Set a random tilt angle for dropped head
const tiltAngle = (Math.random() * 40 + 50)
const tiltDirection = (Math.random() < 0.5 ? 1 : -1)
document.documentElement.style.setProperty('--head-tilt-angle', `${tiltAngle * tiltDirection}deg`)

// DOM init
document.addEventListener('DOMContentLoaded', () => {
	let artHead = document.querySelector('.art-head')
	let tvChannel = document.querySelector('.tv__channel')
	let headChangeGrid = document.querySelector('.head-change-grid')

	// Change head when mousing over head change grid
	document.querySelectorAll('.head-change-grid__trigger').forEach(trigger => {
		trigger.addEventListener('mouseenter', () => {
			artHead.src = `${trigger.dataset.direction}.png` // After Webpack build, image directory is flattened
		})
	})

	let draggableHead = new Draggabilly(artHead, {
		containment: '.landscape__sky',
	})

	draggableHead.on('pointerDown', () => {
		artHead.src = 'ahh.png'
		tvChannel.src = 'maybe.gif'
	})

	draggableHead.on('pointerUp', () => {
		artHead.src = 'center.png'
		tvChannel.src = 'static.gif'
	})

	draggableHead.on('dragStart', () => {
		headChangeGrid.classList.add('head-change-grid--disabled')
	})

	draggableHead.on('dragEnd', () => {
		artHead.src = 'ahh.png'
		tvChannel.src = 'eye.gif'

		// Set head start and end drop positions for CSS
		document.documentElement.style.setProperty('--head-drop-ceiling', `${draggableHead.position.y}px`)
		document.documentElement.style.setProperty('--head-drop-floor', `${window.innerHeight - Math.random() * 90 - 70}px`) // Random floor between 70 and 160 from bottom

		artHead.classList.add('art-head--dropped')

		// Run follow-on function at the end of the CSS transition
		artHead.addEventListener('animationend', postDrop)

		function postDrop (event) {
			// Remove listener so that postDrop only runs once
			event.target.removeEventListener(event.type, postDrop)

			tvChannel.src = 'static.gif'

			// Get head's position
			let { top, left } = window.getComputedStyle(artHead)

			// Strip units (px), and pad for aesthetics
			const headY = parseFloat(top.replace(/[^0-9.]/g, '')) - 15
			const headX = parseFloat(left.replace(/[^0-9.]/g, '')) - 20

			let rubble = document.querySelector('.rubble')
			rubble.style.top = `${headY}px`
			rubble.style.left = `${headX}px`

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
	})
})