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
	let tv = document.querySelector('.tv')
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

		// Determine random space in front of TV to which the head will drop
		const tvBottom = parseFloat(window.getComputedStyle(tv).bottom) // The space between the TV and the bottom of the screen
		const dropZone = tvBottom * 0.8 // The area in which the head will be allowed to drop
		const dropPadding = tvBottom * 0.1 // Padding from the bottom of the screen
		const artHeadHeight = parseFloat(window.getComputedStyle(artHead).height)

		const headDropFloor = Math.random() * dropZone + dropPadding // Random number between 10–90, the desired offset from the bottom
		const headDropTop = window.innerHeight - artHeadHeight - headDropFloor

		// Set head start and end drop positions for CSS
		document.documentElement.style.setProperty('--head-drop-ceiling', `${draggableHead.position.y}px`)
		document.documentElement.style.setProperty('--head-drop-floor', `${headDropTop}px`)

		artHead.classList.add('art-head--dropped')

		// Run follow-on function at the end of the CSS transition
		artHead.addEventListener('animationend', postDrop)

		function postDrop (event) {
			// Remove listener so that postDrop only runs once
			event.target.removeEventListener(event.type, postDrop)

			tvChannel.src = 'static.gif'

			let rubble = document.querySelector('.rubble')
			rubble.style.bottom = `${headDropFloor}px` // Set bottom instead of top to stick rubble to ground on resize
			rubble.style.left = `${parseFloat(window.getComputedStyle(artHead).left) - 20}px` // -20 for aesthetics

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