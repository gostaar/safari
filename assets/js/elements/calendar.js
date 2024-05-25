import { Calendar } from '@fullcalendar/core';
			import dayGridPlugin from '@fullcalendar/daygrid';
			import timeGridPlugin from '@fullcalendar/timegrid';
			import listPlugin from '@fullcalendar/list';
			import { h } from '@fullcalendar/core/preact';

			const CLIENT_ID = '317641776474-5vjf1sapl5rpf39bq7dn39665co8ucvt.apps.googleusercontent.com';
			const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
			const API_KEY = 'AIzaSyCtrR9vgCObA2x3iCMeZbD2RGra3nyFPfU';
			const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
			const agendaId = "37fabe836153a47e0be51057b05bbeed550e066cb060b59d93bcfdf164c8690f@group.calendar.google.com";

			document.getElementById('authorize_button').style.visibility = 'hidden';
			document.getElementById('signout_button').style.visibility = 'hidden';

			async function listUpcomingEvents() {
				let response;
				try {
					const request = {
						'calendarId': agendaId,
						'timeMin': (new Date()).toISOString(),
						'showDeleted': false,
						'singleEvents': true,
						'maxResults': 10,
						'orderBy': 'startTime',
					};
					response = await gapi.client.calendar.events.list(request);
				} catch (err) {
					console.error('Error fetching events:', err);
					return;
				}

				const events = response.result.items;
				const contentElement = document.getElementById('content');
				if (!events || events.length == 0 || !contentElement) {
					// Vérifiez si events est null ou vide, ou si contentElement est null
					console.error('No events found or content element not found.');
					// ici je voudrais afficher le calendrier même vide
					return;
				}

				const convertedEvents = events.map(event => ({
					title: event.summary,
					start: event.start.dateTime || event.start.date,
					end: event.end.dateTime || event.end.date
				}));

				const calendarEl = document.getElementById('calendar');
				const calendar = new Calendar(calendarEl, {
					plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
					initialView: 'timeGridWeek',
					editable: true,
					events: convertedEvents
				});
				calendar.render();

				// Mettre à jour le contenu de l'élément content avec un message de réussite
				contentElement.innerText = 'Events loaded successfully.';
			}