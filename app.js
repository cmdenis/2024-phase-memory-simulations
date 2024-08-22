// returns a gaussian random function with the given mean and stdev.
function boxMuller(val1) {
    var val2 = Math.random()
    var z1 = Math.sqrt(-2*Math.log(val1))*Math.cos(2*Math.PI*val2)
    var z2 = Math.sqrt(-2*Math.log(val1))*Math.sin(2*Math.PI*val2)
    return z1
}

//console.log(frequencies)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



        // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
//var D = math.concat(A, B, 0)               // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
//console.log(C)
//console.log(math.transpose(C).slice(-1))
//console.log(math.add(C.slice(-1), [[1,1, 1]]))




function dphidt(sVector) {
    // returns the derivative of the system using a vector of the different variables as inputs
    d1 = omega1 + k1*Math.sin(sVector[1] - sVector[0]) + k3*Math.sin(sVector[2] - sVector[0])
    d2 = omega2 + k2*Math.sin(sVector[0] - sVector[1])
    d3 = omega3

    return [d1, d2, d3]
}

function dphidt_no_entrainment(sVector) {
    // returns the derivative of the system using a vector of the different variables as inputs
    d1 = omega1 + k1*Math.sin(sVector[1] - sVector[0])
    d2 = omega2 + k2*Math.sin(sVector[0] - sVector[1])
    d3 = omega3

    return [d1, d2, d3]
}

function integrator(phi_0, numberOfTimeStep) {

    var allPhis = [phi_0]

    // Update phi
    for (let i = 0; i < numberOfTimeStep; i++) {
        // do time step
        //phi_0 = math.multiply(timeStep, dphidt(phi_0))


        if (((i + 1)*timeStep < entrainmentStart) || ((i + 1)*timeStep > entrainmentEnd)) {
            phi_0 = math.add(phi_0, math.multiply(timeStep, dphidt_no_entrainment(phi_0)))
        } else {
            phi_0 = math.add(phi_0, math.multiply(timeStep, dphidt(phi_0)))
        }


        // store it in array
        allPhis = math.concat(allPhis, [phi_0], 0)
        //console.log(allPhis)
    }

    return allPhis
}



// Initialize parameters
var timeStep = 0.02
var omega1 = 2.0*Math.PI
var omega2 = 2.0*Math.PI
var omega3 = 2.0*Math.PI*1.28
var k1 = 1.5
var k2 = 1.75
var k3 = 3.6
var phiInit = [0.0, 0.0, 0.0]
var timeLength = 13
var numberOfTimeStep = Math.ceil(timeLength/timeStep)
var entrainmentStart = 1.0
var entrainmentEnd = 10



function drawPlot() {
    

    var sim = integrator(phiInit, numberOfTimeStep)

    phi1 = math.transpose(sim)[0]
    phi2 = math.transpose(sim)[1]
    phi3 = math.transpose(sim)[2]

    times = Array(numberOfTimeStep).fill(1).map((i, j) => j/(numberOfTimeStep - 1)*timeLength)
    
    // Make a plot of the trajectories
    {
        var trace1 = {
            x: times,
            y: math.cos(phi1),
            type: "lines",
            name: "cos(ϕ₁)",
            line: {
                color: 'rgb(255, 124, 254)'
            }
          };

          var trace2 = {
            x: times,
            y: math.cos(phi2),
            type: "lines",
            name: "cos(ϕ₂)",
            line: {
                color: 'rgb(71, 92, 255)'
            }
          };

          var trace3 = {
            x: times,
            y: math.cos(phi3),
            type: "lines",
            name: "cos(ϕ₃)",
            line: {
                color: 'rgb(255, 129, 71)'
            }
          };

        var data = [trace1, trace2, trace3];


        var layout = {
            xaxis: {
              title: "Time",
            },
            yaxis: {
              title: "Amplitude",
            },
            margin: {
              t: 10,
            },
            height: 300,
            shapes: [
                {
                    type: 'rect',
                    x0: entrainmentStart,
                    x1: Math.min(timeLength, entrainmentEnd),
                    y0: -1,
                    y1: 1,
                    fillcolor: '#d3d3d3',
                    opacity: 0.2,
                    line: {
                        width: 0
                    }
                }
            ]
          };
          
        var config = {responsive: true}

        Plotly.newPlot('phasePlot', data, layout, config);
    }
    
    // Make a plot of the derivative of the phase trajectories
    {
        // compute derivative of phases
        copyPhi1 = [...phi1]
        phi1.splice(0, 1)
        copyPhi1.splice(-1, 1)
        derivativePhi1 = math.multiply(math.subtract(phi1, copyPhi1), 1/(timeStep*2*Math.PI))

        copyPhi2 = [...phi2]
        phi2.splice(0, 1)
        copyPhi2.splice(-1, 1)
        derivativePhi2 = math.multiply(math.subtract(phi2, copyPhi2), 1/(timeStep*2*Math.PI))

        copyPhi3 = [...phi3]
        phi3.splice(0, 1)
        copyPhi3.splice(-1, 1)
        derivativePhi3 = math.multiply(math.subtract(phi3, copyPhi3), 1/(timeStep*2*Math.PI))

        times.splice(0, 1)

        



        var trace1 = {
            x: times,
            y: derivativePhi1,
            type: "lines",
            name: "dϕ₁/dt",
            line: {
                color: 'rgb(255, 124, 254)'
            }
          };

          var trace2 = {
            x: times,
            y: derivativePhi2,
            type: "lines",
            name: "dϕ₂/dt",
            line: {
                color: 'rgb(71, 92, 255)'
            }
          };

          var trace3 = {
            x: times,
            y: derivativePhi3,
            type: "lines",
            name: "dϕ₃/dt",
            line: {
                color: 'rgb(255, 129, 71)'
            }
          };

        var data = [trace1, trace2, trace3];


        var layout = {
            xaxis: {
              title: "Time",
            },
            yaxis: {
              title: "dϕ/dt",
            },
            margin: {
              t: 10,
            },
            height: 300,
          };
          
        var config = {responsive: true}

        Plotly.newPlot('phaseDerivativePlot', data, layout, config);
    }
}

drawPlot()









