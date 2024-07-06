<script lang="ts">
	interface Event {
		eventID: string;
		paymentID: string;
		eventName: string;
		eventType: string;
		clientName: string;
		clientNum: string;
		eventDate: string;
		eventTime: string;
		eventVenue: string;
		packageType: string;
		addOn: string;
		staff1: string;
		staff2: string;
		staff3: string;
		staff4: string;
		equipNeeded: string;
		additionalReq: string;
		paymentStatus: string;
	}

	interface Data {
		data: Event[];
	}

	export let data: Data = { data: [] };

	function formatTime(time: string): string {
		const [hours, minutes] = time.split(':');
		const hour = parseInt(hours, 10);
		const suffix = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12; 
		return `${hour12}:${minutes} ${suffix}`;
	}
	function formatDate(dateString: string): string {
		const date = new Date(dateString);

		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		};
		return date.toLocaleDateString('en-US', options);
	}

    let editModes = {}

    function toggleEditMode(eventID) {
        if (editModes[eventID]) {
            editModes[eventID] = false;
        } else {
            editModes[eventID] = true;
        }
    }

	function getCurrentFormattedDate(): string {
        const date = new Date();
        return date.toISOString().split('T')[0]; // Splits the ISO string and takes only the date part.
    }

    function getCurrentFormattedTime(): string {
        const date = new Date();
        let hours = date.getHours().toString().padStart(2, '0'); // Formats hours to two digits
        let minutes = date.getMinutes().toString().padStart(2, '0'); // Formats minutes to two digits
        return `${hours}:${minutes}`;
    }
	function addNewEvent() {
        const newEvent: Event = {
            eventID: 'new' + Math.random().toString(16).slice(2), // Generate a pseudo-random ID
            paymentID: '',
            eventName: 'New Event',
            eventType: '',
            clientName: '',
            clientNum: '',
            eventDate: getCurrentFormattedDate(),
            eventTime: getCurrentFormattedTime(),
            eventVenue: 'New Venue',
            packageType: '',
            addOn: '',
            staff1: '',
            staff2: '',
            staff3: '',
            staff4: '',
            equipNeeded: '',
            additionalReq: '',
            paymentStatus: ''
        };
        data.data = [...data.data, newEvent];
    }
</script>

<h1>employee events</h1>
<br />

<div class="flex flex-col space-y-4">
	{#each data.data as event}
		<div class="collapse bg-base-200">
			<input type="checkbox" name="my-accordion-1" />
			<div class="collapse-title text-xl">
				<span class="font-medium">
					{formatTime(event.eventTime)}
				</span>
				{event.eventName} @ {event.eventVenue}
			</div>
			<div class="collapse-content">
				<div class="card bg-neutral text-neutral-content">
					<div class="card-body">
						<h2 class="card-title">{event.eventName}</h2>
						<p>{event.clientName}</p>
						<div class="flex w-full flex-col border-opacity-50">
							
							<div class="card grid rounded-box p-5">

								<div class="flex flex-row space-x-4">
									<div>
										<h1>date</h1>
										<h2>{formatDate(event.eventDate)}</h2>
	
										<h1>time</h1>
										<h2>{event.eventTime}</h2>
	
										<h1>venue</h1>
										<h2>{event.eventVenue}</h2>
									</div>
									<div>
										<h1>contact</h1>
										<h2>{event.clientNum}</h2>
	
										<h1>package</h1>
										<h2>{event.packageType}</h2>
	
										<h1>total</h1>
										<h2>{event.paymentStatus}</h2>
									</div>
									<div>
										<h1>Staff Assigned</h1>
										{#if event.staff1}
											<h2>{event.staff1}</h2>
										{/if}
										{#if event.staff2}
											<h2>{event.staff2}</h2>
										{/if}
										{#if event.staff3}
											<h2>{event.staff3}</h2>
										{/if}
										{#if event.staff4}
											<h2>{event.staff4}</h2>
										{/if}
	
										<h1>Payment Status</h1>
										<h2>{event.paymentStatus}</h2>
									</div>
								</div>
								<div class="pt-6">
									<h1>specified requests</h1>
									<h2>{event.additionalReq}</h2>
								</div>
							</div>


						</div>

					</div>
				</div>
			</div>
		</div>
	{/each}

</div>

