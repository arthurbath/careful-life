import html from './index.html' // eslint-disable-line no-unused-vars
import css from './style.scss' // eslint-disable-line no-unused-vars
import favicon from './favicon.png' // eslint-disable-line no-unused-vars

import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'

// Entypo symbols
const rubbleSymbols = ['&#x1f4de;', '&#x1f4f1;', '&#xe789;', '&#xe723;', '&#x2709;', '&#x1f53f;', '&#x270e;', '&#x2712;', '&#x1f4ce;', '&#xe777;', '&#xe712;', '&#xe713;', '&#x27a6;', '&#x1f464;', '&#x1f465;', '&#xe700;', '&#xe722;', '&#xe715;', '&#xe724;', '&#xe727;', '&#xe728;', '&#x27a2;', '&#x1f3af;', '&#xe73c;', '&#xe73e;', '&#x2665;', '&#x2661;', '&#x2605;', '&#x2606;', '&#x1f44d;', '&#x1f44e;', '&#xe720;', '&#xe718;', '&#x275e;', '&#x2302;', '&#xe74c;', '&#x1f50d;', '&#x1f526;', '&#xe716;', '&#x1f514;', '&#x1f517;', '&#x2691;', '&#x2699;', '&#x2692;', '&#x1f3c6;', '&#xe70c;', '&#x1f4f7;', '&#x1f4e3;', '&#x263d;', '&#x1f3a8;', '&#x1f342;', '&#x266a;', '&#x266b;', '&#x1f4a5;', '&#x1f393;', '&#x1f4d5;', '&#x1f4f0;', '&#x1f45c;', '&#x2708;', '&#xe788;', '&#xe70a;', '&#x1f554;', '&#x1f3a4;', '&#x1f4c5;', '&#x26a1;', '&#x26c8;', '&#x1f4a7;', '&#x1f4bf;', '&#x1f4bc;', '&#x1f4a8;', '&#x23f3;', '&#x1f6c7;', '&#x1f394;', '&#xe776;', '&#x1f511;', '&#x1f50b;', '&#x1f4fe;', '&#xe7a1;', '&#x1f4fd;', '&#x2615;', '&#x1f680;', '&#xe79a;', '&#x1f6c6;', '&#x1f6c8;', '&#x1f30e;', '&#x2328;', '&#xe74e;', '&#xe74d;', '&#xe76b;', '&#xe76a;', '&#xe769;', '&#xe768;', '&#x1f505;', '&#x1f506;', '&#x25d1;', '&#xe714;', '&#x1f4bb;', '&#x221e;', '&#x1f4a1;', '&#x1f4b3;', '&#x1f4f8;', '&#x2707;', '&#x1f4cb;', '&#xe73d;', '&#x1f4e6;', '&#x1f3ab;', '&#x1f4f6;', '&#x1f4a6;', '&#x25f4;', '&#x1f4ca;', '&#x1f53e;', '&#x1f512;', '&#x1f513;', '&#x229f;', '&#x229e;', '&#x274e;', '&#x2296;', '&#x2295;', '&#x2716;', '&#x232b;', '&#xe705;', '&#xe704;', '&#x26a0;', '&#x1f504;', '&#x27f3;', '&#x27f2;', '&#x1f500;', '&#x1f519;', '&#x21b3;', '&#xe717;', '&#x1f501;', '&#xe771;', '&#x21b0;', '&#x21c6;', '&#xe005;', '&#xe003;', '&#x268f;', '&#x2630;', '&#x1f4c4;', '&#xe731;', '&#xe730;', '&#xe736;', '&#xe737;', '&#x1f304;', '&#x1f3ac;', '&#x1f3b5;', '&#x1f4c1;', '&#xe800;', '&#xe729;', '&#x1f4e4;', '&#x1f4e5;', '&#x1f4be;', '&#xe778;', '&#x2601;', '&#xe711;', '&#x1f4d1;', '&#x1f4d6;', '&#x25b6;', '&#x2016;', '&#x25cf;', '&#x25a0;', '&#x23e9;', '&#x23ea;', '&#xe744;', '&#xe746;', '&#x1f50a;', '&#x1f507;', '&#x1f568;', '&#x1f569;', '&#x1f56a;', '&#x1f56c;', '&#xe4ad;', '&#xe4b0;', '&#xe4af;', '&#xe4ae;', '&#xe759;', '&#xe758;', '&#xe75b;', '&#xe75a;']

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

	// Draggable head
	$('.art-head').draggable({
		containment: '.landscape__sky',
		start: function () {
			artHead.src = 'ahh.png'
			tvChannel.src = 'maybe.gif'
			headChangeGrid.classList.add('head-change-grid--disabled')
		},
		stop: function () {
			tvChannel.src = 'eye.gif'

			// Set random drop floor between 70 and 160 from bottom
			document.documentElement.style.setProperty('--head-drop-floor', `${window.innerHeight - Math.random() * 90 - 70}px`)

			artHead.classList.add('art-head--dropped')

			// Run follow-on function at the end of the CSS transition
			artHead.addEventListener('transitionend', postDrop)

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
					rubble.innerHTML = rubbleSymbols[Math.floor(Math.random() * rubbleSymbols.length)]

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
		},
	})
})