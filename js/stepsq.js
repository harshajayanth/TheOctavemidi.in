//Reverb
var rvb = new Tone.Reverb({
    wet: 0.0 // Adjust the wetness of the reverb
}).toDestination();

//Filter
const filter = new Tone.Filter({
    type: 'lowpass', // Filter type ('lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'notch', 'allpass', 'peaking')
    frequency: 1000, // Initial frequency in Hz
    rolloff: -12, // Roll-off (dB per octave). Default is -12
    Q: 1, // Quality factor. Only relevant for some filter types like 'peaking' and 'bandpass'. Default is 1.
    gain: 0 // Gain of the filter. Only relevant for some filter types like 'peaking' and 'lowshelf' and 'highshelf'. Default is 0.
}).toDestination();
//Feedback
const delayfeedback = new Tone.FeedbackDelay({
    delayTime: 0.0, // Delay time in seconds
    feedback: 0.0,  // Feedback amount (0 to 1)
}).toDestination();



$(document).ready(function () {

    // Create a Tone.js Transport
    const transport = Tone.Transport;

    $("#bpm,#plugin,#filtermode").prop("disabled", true)
    $("#effectlevel").html("Feedback : "+delayfeedback.feedback.value)

    let pluginname,bpm,sequence,players;
    $("#bpm").val(Tone.Transport.bpm.value)
    pluginname = $("#plugin").val();
    bpm=$("#bpm").val()
    change(bpm,pluginname);


    // Create a Tone.js Sequence
    sequence = new Tone.Sequence((time, step) => {
        // Play a sound or trigger any action when a step is active
        for (let c = 0; c < players.length; c++) {
            if (sequence.values[c][step] === 1) {
                playRow(time, c)
            }
        }
    }, Array.from({length: 16}, (_, i) => i), '16n');

    function change(bpm, pluginname) {
        transport.bpm.value = bpm;
       /* console.log(transport.bpm.value, pluginname)*/

        // Create a Tone.js Player for each audio file

        players = [
            new Tone.Player("audio/" + pluginname + "/pad1.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad2.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad3.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad4.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad5.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad6.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad7.wav").toDestination(),
            new Tone.Player("audio/" + pluginname + "/pad8.wav").toDestination(),
            // Add more players for each audio file
        ];

        //Connect Player to FX
        delayfeedback.connect(filter)
        filter.connect(rvb)
        for(let x=0;x<players.length;x++)
            players[x].connect(delayfeedback)
    }

    function playRow(time, row) {
        // Ensure the row index is within the bounds of the players array
        if (row >= 0 && row < players.length && players[row]) {
            // Trigger the player for the corresponding row
            players[row].start(time);
        }
    }

    // Assuming you want a 9x12 grid (8 rows and 16 columns)
    sequence.values = Array.from({length: 8}, () => Array(16).fill(0));


    function animateTimersConsecutively(col) {
        const animationDuration = 60 / Tone.Transport.bpm.value * 1000;

        $(".timer").each(function () {
            const yValue = $(this).data('y');
            if (yValue === col) {
                $(this).css({
                    "animation": `time ${animationDuration}ms infinite ease-in-out`
                });
            }
        });
    }

    // Function to initialize the sequencer grid
    function initSequencer() {
        const sequencer = $('#sequencer');

        // Create the rows and columns
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 16; col++) {
                const cell = $('<div class="cell"></div>');
                cell.data('row', row);
                cell.data('col', col);

                // Oddcell CSS
                if (row % 2 === 0 && col % 2 !== 0) {
                    cell.addClass('oddcell');
                } else if (row % 2 !== 0 && col % 2 === 0) {
                    cell.addClass('oddcell');
                }

                // Border radius
                if (row === 3 && col === 7) {
                    cell.css("border-radius", "0 0 13px 0");
                }
                if (row === 3 && col === 8) {
                    cell.css("border-radius", "0 0 0px 13px");
                }
                if (row === 4 && col === 7) {
                    cell.css("border-radius", "0px 13px 0px 0");
                }
                if (row === 4 && col === 8) {
                    cell.css("border-radius", "13px 0px 0px 0");
                }

                // Add click event to toggle active state
                cell.click(function () {
                    $(this).toggleClass('active');
                    const row = $(this).data('row');
                    const col = $(this).data('col');
                    /*console.log(row, col)*/

                    if ($(this).hasClass("active")) {
                        sequence.values[row][col] = 1;
                        sequence.start()
                        $(".cell.stop").toggleClass("active stop");
                        $("#bpm,#plugin").prop("disabled", true)
                    } else {
                        sequence.values[row][col] = 0;
                    }
                });

                sequencer.append(cell);
            }
        }

        // Timer
        for (let x = 0; x < 1; x++) {
            for (let y = 0; y < 16; y++) {
                const timer = $('<div class="timer mt-2 d-flex ml-4"></div>')
                timer.data('y', y);
                sequencer.append(timer);
                animateTimersConsecutively(y);
            }
        }
    }


    // Start the Tone.js Transport and Sequence
    function startSequencer() {
        Tone.start();
        transport.start();
        sequence.start();
    }

    // Initialize and start the sequencer
    initSequencer();
    startSequencer();

    //Stop Sequence
    $("#stop").click(function () {
        $("#bpm,#plugin").prop("disabled", false)
        $(".cell.active").toggleClass("active stop");
        sequence.stop();
    })

    //Start Sequence
    $("#play").click(function () {
        bpm = $("#bpm").val();
        pluginname = $("#plugin").val()
        $(".cell.stop").toggleClass("active stop");
        change(bpm, pluginname);
        sequence.start();
        $("#bpm,#plugin").prop("disabled", true)


    })

    //Clear Sequence
    $("#clear").click(function () {
        $("#bpm,#plugin").prop("disabled", false)
        sequence.stop();
        sequence.values = Array.from({length: 8}, () => Array(16).fill(0));
        $(".cell").removeClass("active");
        $(".cell").removeClass("stop");
    })

})

/////////////////////////////////////////// STEP SEQUENCER EFFECT //////////////////////////////////////////////////
function ControlChange(controlNumber, controlValue) {
    // MIDI CC 7 (Main Feedback)
    if (controlNumber === 74) {
        $("#filtermode").prop("disabled",true)
        let sqfdb = (controlValue / 127).toFixed(1);
        $("#effectlevel").html("Feedback : "+sqfdb);
        delayfeedback.set({feedback: sqfdb});
        let borderColor = "hsl(" + (sqfdb) * 360 + ", 100%, 50%)";
        $(".sqknob1").css("border", "5px solid " + borderColor);
        $(".sqknob1").css("transform", "rotate(" + (sqfdb * 360) + "deg)");
    }
    else if (controlNumber === 75) {
        $("#filtermode").prop("disabled",false)
        let filtermode=$("#filtermode").val();
        let sqflt = ((controlValue / 127).toFixed(1)*44100);
        $("#effectlevel").html("Frequency : "+(sqflt/1000).toFixed(1)+"kHz")
        filter.set({type: filtermode,frequency: sqflt});
        let borderColor = "hsl(" + (sqflt) * 360 + ", 100%, 50%)";
        $(".sqknob2").css("border", "5px solid " + borderColor);
        $(".sqknob2").css("transform", "rotate(" + ((controlValue / 127) * 360) + "deg)");
    }
    else if (controlNumber === 76) {
        $("#filtermode").prop("disabled",true)
        let sqrvb = (controlValue / 127).toFixed(1);
        $("#effectlevel").html("Reverb : "+sqrvb)
        rvb.set({wet: sqrvb});
        let borderColor = "hsl(" + (sqrvb) * 360 + ", 100%, 50%)";
        $(".sqknob3").css("border", "5px solid " + borderColor);
        $(".sqknob3").css("transform", "rotate(" + (sqrvb * 360) + "deg)");
    }
    else if (controlNumber === 77) {
        $("#filtermode").prop("disabled",true)
        let sqdelay = (controlValue / 127).toFixed(1);
        $("#effectlevel").html("Delay : "+sqdelay)
        delayfeedback.set({delayTime: sqdelay});
        let borderColor = "hsl(" + (sqdelay) * 360 + ", 100%, 50%)";
        $(".sqknob4").css("border", "5px solid " + borderColor);
        $(".sqknob4").css("transform", "rotate(" + (sqdelay * 360) + "deg)");
    }
}