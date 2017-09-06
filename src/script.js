import html from './index.html' // eslint-disable-line no-unused-vars
import css from './style.scss' // eslint-disable-line no-unused-vars
import favicon from './favicon.png' // eslint-disable-line no-unused-vars

import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'

// Entypo characters
const rubble = ['&#x1f4de;', '&#x1f4f1;', '&#xe789;', '&#xe723;', '&#x2709;', '&#x1f53f;', '&#x270e;', '&#x2712;', '&#x1f4ce;', '&#xe777;', '&#xe712;', '&#xe713;', '&#x27a6;', '&#x1f464;', '&#x1f465;', '&#xe700;', '&#xe722;', '&#xe715;', '&#xe724;', '&#xe727;', '&#xe728;', '&#x27a2;', '&#x1f3af;', '&#xe73c;', '&#xe73e;', '&#x2665;', '&#x2661;', '&#x2605;', '&#x2606;', '&#x1f44d;', '&#x1f44e;', '&#xe720;', '&#xe718;', '&#x275e;', '&#x2302;', '&#xe74c;', '&#x1f50d;', '&#x1f526;', '&#xe716;', '&#x1f514;', '&#x1f517;', '&#x2691;', '&#x2699;', '&#x2692;', '&#x1f3c6;', '&#xe70c;', '&#x1f4f7;', '&#x1f4e3;', '&#x263d;', '&#x1f3a8;', '&#x1f342;', '&#x266a;', '&#x266b;', '&#x1f4a5;', '&#x1f393;', '&#x1f4d5;', '&#x1f4f0;', '&#x1f45c;', '&#x2708;', '&#xe788;', '&#xe70a;', '&#x1f554;', '&#x1f3a4;', '&#x1f4c5;', '&#x26a1;', '&#x26c8;', '&#x1f4a7;', '&#x1f4bf;', '&#x1f4bc;', '&#x1f4a8;', '&#x23f3;', '&#x1f6c7;', '&#x1f394;', '&#xe776;', '&#x1f511;', '&#x1f50b;', '&#x1f4fe;', '&#xe7a1;', '&#x1f4fd;', '&#x2615;', '&#x1f680;', '&#xe79a;', '&#x1f6c6;', '&#x1f6c8;', '&#x1f30e;', '&#x2328;', '&#xe74e;', '&#xe74d;', '&#xe76b;', '&#xe76a;', '&#xe769;', '&#xe768;', '&#x1f505;', '&#x1f506;', '&#x25d1;', '&#xe714;', '&#x1f4bb;', '&#x221e;', '&#x1f4a1;', '&#x1f4b3;', '&#x1f4f8;', '&#x2707;', '&#x1f4cb;', '&#xe73d;', '&#x1f4e6;', '&#x1f3ab;', '&#x1f4f6;', '&#x1f4a6;', '&#x25f4;', '&#x1f4ca;', '&#x1f53e;', '&#x1f512;', '&#x1f513;', '&#x229f;', '&#x229e;', '&#x274e;', '&#x2296;', '&#x2295;', '&#x2716;', '&#x232b;', '&#xe705;', '&#xe704;', '&#x26a0;', '&#x1f504;', '&#x27f3;', '&#x27f2;', '&#x1f500;', '&#x1f519;', '&#x21b3;', '&#xe717;', '&#x1f501;', '&#xe771;', '&#x21b0;', '&#x21c6;', '&#xe005;', '&#xe003;', '&#x268f;', '&#x2630;', '&#x1f4c4;', '&#xe731;', '&#xe730;', '&#xe736;', '&#xe737;', '&#x1f304;', '&#x1f3ac;', '&#x1f3b5;', '&#x1f4c1;', '&#xe800;', '&#xe729;', '&#x1f4e4;', '&#x1f4e5;', '&#x1f4be;', '&#xe778;', '&#x2601;', '&#xe711;', '&#x1f4d1;', '&#x1f4d6;', '&#x25b6;', '&#x2016;', '&#x25cf;', '&#x25a0;', '&#x23e9;', '&#x23ea;', '&#xe744;', '&#xe746;', '&#x1f50a;', '&#x1f507;', '&#x1f568;', '&#x1f569;', '&#x1f56a;', '&#x1f56c;', '&#xe4ad;', '&#xe4b0;', '&#xe4af;', '&#xe4ae;', '&#xe759;', '&#xe758;', '&#xe75b;', '&#xe75a;']

// Set a custom random tile angle for head on drop
const tiltAngle = (Math.random() * 40 + 50)
const tiltDirection = (Math.random() < 0.5 ? 1 : -1)
document.documentElement.style.setProperty('--head-tilt-angle', `${tiltAngle * tiltDirection}deg`)

// Document init
$(document).ready(function () {
	$.fx.interval = 35

	// Change heads on mousemove
	$('.headgrid td').mouseover(function () {
		let gridCell = $(this).attr('class')
		if (gridCell != null) {
			$('.head').attr('src', gridCell + '.png')
		}
	})

	// Draggable head
	$('.head').draggable({
		containment: '.landscape__sky',
		start: function () {
			$(this).attr('src', 'ahh.png')
			$('.channels img').attr('src', 'maybe.gif')
			$('.headgrid').hide()
		},
		stop: function () {
			$('.channels img').attr('src', 'eye.gif')

			let dropTo = $(window).height() - Math.random() * 90 - 70 // Only drop between 70 and 160

			$('.head').addClass('head--dropped')

			// Drop head
			$(this).animate({ top: dropTo }, 500, function () {
				$('.channels img').attr('src', 'static.gif')

				let headX = $('.head').css('left')
				let headY = $('.head').css('top')
				headX = parseFloat(headX.substring(0, headX.length - 2)) + 20 // +20 for aesthetics
				headY = parseFloat(headY.substring(0, headY.length - 2)) - 5 // -5 for aesthetics

				$('body').append('<div class="rubble-bin"></div>')

				$('.rubble-bin').append('<p class="rubble" style="top: ' + headY + 'px; left: ' + headX + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 14) + 'px; left: ' + (headX + 10) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 14) + 'px; left: ' + (headX - 10) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 28) + 'px; left: ' + (headX + 20) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 28) + 'px; left: ' + (headX) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 28) + 'px; left: ' + (headX - 20) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 42) + 'px; left: ' + (headX + 30) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 42) + 'px; left: ' + (headX + 10) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 42) + 'px; left: ' + (headX - 10) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 42) + 'px; left: ' + (headX - 30) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 56) + 'px; left: ' + (headX + 40) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 56) + 'px; left: ' + (headX + 20) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 56) + 'px; left: ' + (headX) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 56) + 'px; left: ' + (headX - 20) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')
				$('.rubble-bin').append('<p class="rubble" style="top: ' + (headY + 56) + 'px; left: ' + (headX - 40) + 'px;">' + rubble[Math.floor(Math.random() * rubble.length)] + '</p>')

				$('.rubble-bin' + ' .rubble').each(function () {
					$(this).animate({ opacity: 1 }, Math.random() * 3000 + 2000)
				})

				$(this).fadeOut(3000)

				$('.dog').animate({ left: '100%' }, 7000, 'linear', function () {
					$('.dog').css('left', -200)
				})
			})
		},
	})
})