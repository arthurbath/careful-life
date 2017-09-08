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
			const headX = parseFloat(left.replace(/[^0-9.]/g, '')) + 20
			const headY = parseFloat(top.replace(/[^0-9.]/g, '')) - 5

			// Set coordinates of rubble pyramid
			const rubbleCoords = [
				// Top
				{ x: headX, y: headY },
				// Tier 2
				{ x: headX + 10, y: headY + 14 },
				{ x: headX - 10, y: headY + 14 },
				// Tier 3
				{ x: headX + 20, y: headY + 28 },
				{ x: headX, y: headY + 28 },
				{ x: headX - 20, y: headY + 28 },
				// Tier 4
				{ x: headX + 30, y: headY + 42 },
				{ x: headX + 10, y: headY + 42 },
				{ x: headX - 10, y: headY + 42 },
				{ x: headX - 30, y: headY + 42 },
				// Tier 5
				{ x: headX + 40, y: headY + 56 },
				{ x: headX + 20, y: headY + 56 },
				{ x: headX, y: headY + 56 },
				{ x: headX - 20, y: headY + 56 },
				{ x: headX - 40, y: headY + 56 }
			]

			// For each of the coordinates specified, append a piece of rubble to the body
			rubbleCoords.forEach(rubbleCoord => {
				let rubble = document.createElement('div')
				rubble.classList.add('rubble')
				rubble.style.top = `${rubbleCoord.y}px`
				rubble.style.left = `${rubbleCoord.x}px`
				rubble.textContent = rubbleSymbols[Math.floor(Math.random() * rubbleSymbols.length)]

				document.body.appendChild(rubble)
			})

			// Fade in rubble after random short delays
			document.querySelectorAll('.rubble').forEach(rubble => {
				const randomDelay = Math.random() * 1000 + 500 // Random time between 0.5–1.5s

				setTimeout(() => {
					rubble.classList.add('rubble--appeared')
				}, randomDelay)
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