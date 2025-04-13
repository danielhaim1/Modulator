// Scorll Down Logger
const scrollOutputToBottom = () => {
	const output = document.querySelector ( "#output" );
	output.scrollTop = output.scrollHeight;
};

// Logger
const eventData = new Map ();
const modulatorDelay = 500;
const logDelay = 1000;

function logEvent (
	event,
	delay = 0,
	count = null,
	eventType = null,
	useModulator = false,
	onComplete = null
) {
	const timestamp = new Date ().toLocaleTimeString ( undefined, {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 3
	} );
	let color = "#fff";
	
	switch (eventType) {
		case "scroll":
			color = "#ffdd40";
			break;
		case "resize":
			color = "#f44336";
			break;
		case "click":
			color = "#ff0000";
			break;
		case "announce":
			color = "#00a99d";
			break;
		default:
			break;
	}
	
	const timer = delay > 0 ? `${ delay }ms` : "";
	const countText = count !== null ? `#${ count }` : "";
	let logText = `<span style="color:#777">${ timestamp }:</span> <span style="color:${ color }">${ event } ${ countText } detected</span><br />`;
	if ( eventType === "announce" ) {
		logText = `<span style="color:#777">${ timestamp }:</span> <span style="color:${ color }">${ event } ${ countText }</span><br />`;
	}
	output.innerHTML += logText;
	scrollOutputToBottom ();
	
	if ( useModulator ) {
		setTimeout ( () => {
			const completedEvent = `${ new Date ().toLocaleTimeString () }: ${ event } ${ countText } completed after ${ timer }.`;
			output.innerHTML += `<span style="color:#777">${ new Date ().toLocaleTimeString (
				undefined,
				{
					hour12: false,
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					fractionalSecondDigits: 3
				}
			) }:</span> <span style="color:${ color }">${ completedEvent }</span><br />`;
			onComplete?. ();
		}, delay );
	} else {
		onComplete?. ();
	}
}

function onCompletedEvent ( eventType, count ) {
	let useModulator;
	if ( useModulator ) {
		const eventKey = `${ eventType }-${ count }`;
		const eventDataObj = eventData.get ( eventKey );
		const start = eventDataObj.start;
		const end = performance.now ();
		const time = end - start;
		
		const onComplete = function () {
			const timestamp = new Date ().toLocaleTimeString ( undefined, {
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				fractionalSecondDigits: 3
			} );
			let color = "#fff";
			
			switch (eventType) {
				case "scroll":
					color = "#ffdd40";
					break;
				case "resize":
					color = "#f44336";
					break;
				case "click":
					color = "#ff0000";
					break;
				default:
					break;
			}
			
			const eventText = `${ eventType } #${ count }`;
			const timeText = `took ${ time }ms to execute.`;
			const logText = `<span style="color:#777">${ timestamp }:</span> <span style="color:${ color }">${ eventText } ${ timeText }</span><br />`;
			
			output.innerHTML += logText;
			scrollOutputToBottom ();
		};
		
		onComplete ();
		eventData.delete ( eventKey );
	}
}

const container = document.querySelector ( ".container" );
const output = document.querySelector ( "#output" );

function addEventListeners () {
	removeEventListeners (); // remove old event listeners before adding new ones
	window.addEventListener (
		"resize",
		useModulator
			? Modulator.modulate ( () => {
				resizeDebounceExecuting = true;
				resizeCounter++;
				logEvent ( `Resize detected`, logDelay, null, "resize", true, () => {
					onCompletedEvent ( "resize", resizeCounter );
					resizeDebounceExecuting = false;
				} );
			}, modulatorDelay )
			: () => {
				resizeListener ();
				onCompletedEvent ( "resize", resizeCounter );
			}
	);
	
	window.addEventListener (
		"scroll",
		useModulator
			? Modulator.modulate ( () => {
				scrollDebounceExecuting = true;
				scrollCounter++;
				logEvent (
					`window.scroll #${ scrollCounter } detected`,
					logDelay,
					null,
					"scroll",
					true,
					() => {
						onCompletedEvent ( "scroll", scrollCounter );
						scrollDebounceExecuting = false;
					}
				);
			}, modulatorDelay )
			: () => {
				scrollListener ();
				onCompletedEvent ( "scroll", scrollCounter );
			}
	);
}

let resizeCounter = 0;
let resizeDebounceExecuting = false;
let resizeListener = () => {
	resizeCounter++;
	logEvent ( `Resize`, 1000, resizeCounter, "resize" );
};
const modulatedResizeListener = Modulator.modulate ( () => {
	resizeDebounceExecuting = true;
	const startTime = performance.now ();
	logEvent ( `Resize detected`, 0, resizeCounter, "resize" );
	resizeListener ();
	const endTime = performance.now ();
	const duration = endTime - startTime;
	logEvent (
		`Resize executed in ${ duration.toFixed ( 2 ) }ms`,
		0,
		resizeCounter,
		"resize"
	);
	resizeDebounceExecuting = false;
}, modulatorDelay );

let scrollCounter = 0;
let scrollDebounceExecuting = false;
let scrollListener = () => {
	scrollCounter++;
	logEvent ( `Scroll`, 0, scrollCounter, "scroll" );
};

const modulatedScrollListener = Modulator.modulate ( () => {
	if ( scrollDebounceExecuting ) {
		return;
	}
	scrollDebounceExecuting = true;
	const startTime = performance.now ();
	logEvent ( `Scroll detected`, 0, scrollCounter, "scroll" );
	scrollListener ();
	const endTime = performance.now ();
	const duration = endTime - startTime;
	logEvent (
		`Scroll executed in ${ duration.toFixed ( 2 ) }ms`,
		0,
		scrollCounter,
		"scroll"
	);
	scrollDebounceExecuting = false;
}, modulatorDelay );

// let clickCounter = 0;
// let clickDebounceExecuting = false;
// let clickListener = () => {
//   clickCounter++;
//   logEvent(`Click`, 1000, clickCounter, "click");
// };

// const modulatedClickListener = modulate(() => {
//   if (clickDebounceExecuting) {
//     return;
//   }
//   clickDebounceExecuting = true;
//   const startTime = performance.now();
//   logEvent(`Click detected`, 0, clickCounter, "click");
//   clickListener();
//   const endTime = performance.now();
//   const duration = endTime - startTime;
//   logEvent(
//     `Click executed in ${duration.toFixed(2)}ms`,
//     0,
//     clickCounter,
//     "click"
//   );
//   clickDebounceExecuting = false;
// }, modulatorDelay);

function removeEventListeners () {
	window.removeEventListener ( "resize", modulatedResizeListener );
	window.removeEventListener ( "scroll", modulatedScrollListener );
	
	window.removeEventListener ( "resize", resizeListener );
	window.removeEventListener ( "scroll", scrollListener );
}

const toggleSwitch = document.getElementById ( "toggleDebounce" );
const srHidden = document.querySelector ( ".sr-hidden" );

toggleSwitch.addEventListener ( "change", ( event ) => {
	removeEventListeners ();
	
	if ( event.target.checked ) {
		window.addEventListener ( "resize", modulatedResizeListener );
		window.addEventListener ( "scroll", modulatedScrollListener );
		// window.addEventListener("click", modulatedClickListener);
		srHidden.textContent = "Modulator On";
		logEvent ( `Modulator On`, 0, null, "announce" );
	} else {
		window.addEventListener ( "resize", resizeListener );
		window.addEventListener ( "scroll", scrollListener );
		// window.addEventListener("click", clickListener);
		srHidden.textContent = "Modulator Off";
		logEvent ( `Modulator Off`, 0, null, "announce" );
	}
} );

toggleSwitch.setAttribute ( "role", "switch" );
toggleSwitch.setAttribute ( "aria-checked", toggleSwitch.checked );
toggleSwitch.setAttribute ( "aria-labelledby", "toggleDebounceLabel" );

toggleSwitch.click ();
