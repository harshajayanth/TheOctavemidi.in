$(document).ready(function () {

    $("#midifailure,#midicontrol,#StepSequencersection").hide();

    $("#Reverbanimate,#delayanimate,#pananimate").hide();
    $("#fxname").html("FeedBack")

    //Drum Pad and Stepsequencer
    $("#dp").click(function (){
        $(this).addClass("group-css")
        $("#ss").removeClass("group-css")
        $("#StepSequencersection").hide()
        $("#DrumPadsection").fadeIn();
    })

    $("#ss").click(function (){
        $(this).addClass("group-css")
        $("#dp").removeClass("group-css")
        $("#StepSequencersection").fadeIn()
        $("#DrumPadsection").hide();
    })

    var audioContextStarted = false;

    // Function to start the AudioContext
    function startAudioContext() {
        if (!audioContextStarted) {
            Tone.start().then(() => {
                audioContextStarted = true;
            }).catch((error) => {
                console.error("Error starting audio context:", error);
            });
        }
    }

    $("#start").click(function () {
        $(this).hide();
        $("#midi").hide()
        $("#midicontrol").fadeIn()
        startAudioContext()
    })

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then(onMIDISuccess, onMIDIFailure);
    } else {
        alert("Web MIDI API not supported in this browser.");
    }

    function onMIDISuccess(midiAccess) {

        //Main Input
        var inputs = midiAccess.inputs.values();
        var piano = new Tone.Sampler({
            C4: "audio/piano.wav"
            // Add more samples for other notes
        }).toDestination();

        //Change Instrument
        $("#piano").click(function () {
            $("#guitar,#strings,#synth").removeClass("bg-white text-black")
            $("#guitar,#strings,#synth").addClass("bg-dark text-white")
            $(this).removeClass("bg-dark text-white")
            $(this).addClass("bg-white text-black")
            piano.add("C4", "audio/piano.wav", function () {
                piano.triggerAttack("C4");
            });
        });
        $("#guitar").click(function () {
            $("#piano,#strings,#synth").removeClass("bg-white text-black")
            $("#piano,#strings,#synth").addClass("bg-dark text-white")
            $(this).removeClass("bg-dark text-white")
            $(this).addClass("bg-white text-black")
            piano.add("C4", "audio/guitar.wav", function () {
                piano.triggerAttack("C4");
            });
        });
        $("#synth").click(function () {
            $("#guitar,#strings,#piano").removeClass("bg-white text-black")
            $("#guitar,#strings,#piano").addClass("bg-dark text-white")
            $(this).removeClass("bg-dark text-white")
            $(this).addClass("bg-white text-black")
            piano.add("C4", "audio/synth.wav", function () {
                piano.triggerAttack("C4");
            });
        });
        $("#strings").click(function () {
            $("#piano,#guitar,#synth").removeClass("bg-white text-black")
            $("#piano,#guitar,#synth").addClass("bg-dark text-white")
            $(this).removeClass("bg-dark text-white")
            $(this).addClass("bg-white text-black")
            piano.add("C4", "audio/string.wav", function () {
                piano.triggerAttack("C4");
            });
        });

        //Reverb
        var reverb = new Tone.Reverb({
            wet: 0.0 // Adjust the wetness of the reverb
        }).toDestination();
        //Pan
        var pan = new Tone.Panner(0.0).toDestination()
        $(".knob2").css("transform", "rotate(" + 180 + "deg)");
        //Feedback
        const feedbackDelay = new Tone.FeedbackDelay({
            delayTime: 0.0, // Delay time in seconds
            feedback: 0.0,  // Feedback amount (0 to 1)
        }).toDestination();

        function playpadAudio(audio, kitname) {
            const audioPath = "audio/" + kitname + "/" + audio;
            const audioPlayer = new Audio(audioPath);
            audioPlayer.addEventListener('canplay', () => {
                audioPlayer.play();
            });
            $(".bar").addClass("animate-bar");

            setTimeout(() => {
                $(".bar").removeClass("animate-bar");
            }, 1000);
        }

        //Connect the FX
        pan.connect(reverb);
        reverb.connect(feedbackDelay)
        piano.connect(pan);

        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            let deviceName = input.value.name;
            $("#deviceName").html(deviceName);

            $("#img").attr("src", "images/" + deviceName + ".jpeg");


            input.value.onmidimessage = function (event) {

                let messageType = event.data[0];
                let note = event.data[1];
                let velocity = event.data[2];
                let controlNumber = event.data[1];
                let controlValue = event.data[2];

                //Pads
                $.getJSON('js/padaudio.json', function (data) {
                    let program = "";
                    let file;
                    let programname = $("#programname").val();
                    $("#programimg").attr("src", "audio/" + programname + "/kit.jpg");
                    if (controlNumber === 16) {
                        let program = data["Beat"][4];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 5)
                        $(`#pad5`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad5`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 17) {
                        let program = data["Beat"][5];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 6)
                        $(`#pad6`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad6`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 18) {
                        let program = data["Beat"][6];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 7)
                        $(`#pad7`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad7`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 19) {
                        let program = data["Beat"][7];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 8)
                        $(`#pad8`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad8`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 20) {
                        program = data["Beat"][0];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 1)
                        $(`#pad1`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad1`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 21) {
                        program = data["Beat"][1];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 2)
                        $(`#pad2`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad2`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 22) {
                        let program = data["Beat"][2];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 3)
                        $(`#pad3`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad3`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 23) {
                        let program = data["Beat"][3];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 4)
                        $(`#pad4`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad4`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 24) {
                        let program = data["Beat"][12];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 13)
                        $(`#pad13`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad13`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 25) {
                        let program = data["Beat"][13];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 14)
                        $(`#pad14`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad14`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 26) {
                        let program = data["Beat"][14];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 15)
                        $(`#pad15`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad15`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 27) {
                        let program = data["Beat"][15];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 16)
                        $(`#pad16`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad16`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 28) {
                        let program = data["Beat"][8];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 9)
                        $(`#pad9`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad9`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 29) {
                        let program = data["Beat"][9];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 10)
                        $(`#pad10`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad10`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 30) {
                        let program = data["Beat"][10];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 11)
                        $(`#pad11`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad11`).removeClass("padactive")
                        }, 100)
                    } else if (controlNumber === 31) {
                        let program = data["Beat"][11];
                        if (program.pad === controlNumber) {
                            file = program.audio
                            playpadAudio(file, programname);
                        }
                        $("#padname").html("Pad" + " " + 12)
                        $(`#pad12`).addClass("padactive")
                        setTimeout(function () {
                            $(`#pad12`).removeClass("padactive")
                        }, 100)
                    }
                })


                // Note On event
                if (event.data[0] === 144 && velocity > 0) {
                    let noteName = Tone.Frequency(note, "midi").toNote();
                    let pressedKey = $(".white-key[data-key='" + noteName[0] + "']");
                    if (noteName[1] !== '#') {
                        pressedKey.css("background", "#33da8f");
                        setTimeout(function () {
                            pressedKey.css("background", "white");
                        }, 500);
                        $("#noteName").html(noteName + " " + pressedKey.data("raag"))
                    } else {
                        let pressedKey = $(".black-key[data-key='" + noteName[0] + "#" + "']");
                        pressedKey.css("background", "#33da8f");
                        setTimeout(function () {
                            pressedKey.css("background", "black");
                        }, 500);
                        $("#noteName").html(noteName + " " + pressedKey.data("raag"))
                    }
                    playPianoNote(noteName);
                }
                // Note Off event
                else if (event.data[0] === 128 || (event.data[0] === 144 && velocity === 0)) {
                    stopPianoNote(note);
                }
                // Check if it's a Control Change message
                if (messageType === 176) {
                    handleControlChange(controlNumber, controlValue);
                    ControlChange(controlNumber,controlValue);
                }
            }
            ;
        }

        function handleControlChange(controlNumber, controlValue) {
            // MIDI CC 7 (Main Feedback)
            if (controlNumber === 70) {
                $("#delayanimate, #Reverbanimate,#pananimate").hide();
                $("#fdbanimate").fadeIn();
                $("#fxname").html("FeedBack")
                var normalizedfdb = (controlValue / 127).toFixed(1);
                feedbackDelay.set({feedback: normalizedfdb});
                $("#feedbacklevel").html(normalizedfdb)
                var borderColor = "hsl(" + (normalizedfdb) * 360 + ", 100%, 50%)";
                $(".knob1").css("border", "5px solid " + borderColor);
                $(".knob1").css("transform", "rotate(" + (normalizedfdb * 360) + "deg)");
                if (normalizedfdb === '0.0') {
                    $(`.wave2, .wave3, .wave4`).css("top", `${115}%`)
                } else if (normalizedfdb === '0.1') {
                    $(`.wave2`).css("top", `${110}%`)
                    $(`.wave3`).css("top", `${112}%`)
                } else if (normalizedfdb === '0.2') {
                    $(`.wave2`).css("top", `${108}%`)
                    $(`.wave3`).css("top", `${110}%`)
                    $(`.wave4`).css("top", `${114}%`)
                } else if (normalizedfdb === '0.3') {
                    $(`.wave2`).css("top", `${106}%`)
                    $(`.wave3`).css("top", `${109}%`)
                    $(`.wave4`).css("top", `${113}%`)
                } else if (normalizedfdb === '0.4') {
                    $(`.wave2`).css("top", `${105}%`)
                    $(`.wave3`).css("top", `${108}%`)
                    $(`.wave4`).css("top", `${112}%`)
                } else if (normalizedfdb === '0.5') {
                    $(`.wave2`).css("top", `${104}%`)
                    $(`.wave3`).css("top", `${107}%`)
                    $(`.wave4`).css("top", `${110}%`)
                } else if (normalizedfdb === '0.6') {
                    $(`.wave2`).css("top", `${102}%`)
                    $(`.wave3`).css("top", `${105}%`)
                    $(`.wave4`).css("top", `${109}%`)
                } else if (normalizedfdb === '0.7') {
                    $(`.wave2`).css("top", `${96}%`)
                    $(`.wave3`).css("top", `${100}%`)
                    $(`.wave4`).css("top", `${108}%`)
                } else if (normalizedfdb === '0.8') {
                    $(`.wave2`).css("top", `${88}%`)
                    $(`.wave3`).css("top", `${95}%`)
                    $(`.wave4`).css("top", `${106}%`)
                } else if (normalizedfdb === '0.9') {
                    $(`.wave2`).css("top", `${82}%`)
                    $(`.wave3`).css("top", `${90}%`)
                    $(`.wave4`).css("top", `${100}%`)
                } else if (normalizedfdb === '1.0') {
                    $(`.wave2`).css("top", `${70}%`)
                    $(`.wave3`).css("top", `${80}%`)
                    $(`.wave4`).css("top", `${95}%`)
                }
            }
            //Main Pan
            else if (controlNumber === 71) {
                $("#delayanimate, #Reverbanimate,#fdbanimate").hide();
                $("#pananimate").fadeIn();
                $("#fxname").html("Pan");
                var normalizedpan = ((controlValue / 127) * 2 - 1).toFixed(1); // Map 0-127 to -1.0 to 1.0
                pan.pan.value = normalizedpan;
                $("#panlevel").html(normalizedpan);
                var borderColor = "hsl(" + (controlValue / 127) * 360 + ", 100%, 50%)";
                $(".knob2").css("border", "5px solid " + borderColor);
                $(".knob2").css("transform", "rotate(" + (controlValue / 127) * 360 + "deg)");

                var rotationValue = ((controlValue / 127) * 285) + 80 // Rotate from 45 to 285 degrees
                $('.pulsefdb').css("transform", "rotate(" + rotationValue + "deg)");
            }
            //(Main Reverb)
            else if (controlNumber === 72) {
                $("#delayanimate,#pananimate,#fdbanimate").hide();
                $("#Reverbanimate").fadeIn()
                $("#fxname").html("Reverb")
                var normalizedreverb = (controlValue / 127).toFixed(1);
                reverb.set({wet: normalizedreverb});
                $("#reverblevel").html(normalizedreverb)
                var borderColor = "hsl(" + (normalizedreverb) * 360 + ", 100%, 50%)";
                $(".knob3").css("border", "5px solid " + borderColor);
                $(".knob3").css("transform", "rotate(" + (normalizedreverb * 360) + "deg)");
                const circleSize = 50 + normalizedreverb * 100; // Adjust the multiplier as needed

                $('.reverbcircle1').css({
                    width: `${circleSize + 40}px`,
                    height: `${circleSize + 40}px`
                });
                $('.reverbcircle2').css({
                    width: `${circleSize + 30}px`,
                    height: `${circleSize + 30}px`
                });
                $('.reverbcircle3').css({
                    width: `${circleSize + 20}px`,
                    height: `${circleSize + 20}px`
                });
                $('.reverbcircle4').css({
                    width: `${circleSize}px`,
                    height: `${circleSize}px`
                });
            }
            //Main Delay
            else if (controlNumber === 73) {
                $("#Reverbanimate,#pananimate,#fdbanimate").hide();
                $("#delayanimate").fadeIn()
                $("#fxname").html("Delay")
                var normalizeddelay = (controlValue / 127).toFixed(1);
                feedbackDelay.set({delayTime: normalizeddelay});
                $("#delaylevel").html(normalizeddelay)
                var borderColor = "hsl(" + (normalizeddelay) * 360 + ", 100%, 50%)";
                $(".knob4").css("border", "5px solid " + borderColor);
                $(".knob4").css("transform", "rotate(" + (normalizeddelay * 360) + "deg)");
                for (let i = 2; i <= 7; i++) {
                    // Calculate opacity based on delay level
                    const opacity = Math.min(normalizeddelay * i / 7, 1);

                    // Apply opacity and size to the corresponding child circle
                    $(`.child-circle${i}`).css({
                        opacity: opacity,
                    });
                }
            }
        }

        function playPianoNote(note) {
            piano.triggerAttack(note, "+0.05");

            $(".bar").addClass("animate-bar");

            setTimeout(() => {
                $(".bar").removeClass("animate-bar");
            }, 2000);

        }

        function stopPianoNote(note) {
            piano.triggerRelease(note);
        }

    }

    function onMIDIFailure(error) {
        console.log("failed", error)
    }

})
