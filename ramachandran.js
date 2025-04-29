const svgPageWidth = 4582.802;
const svgPageHeight = 4582.802;
const svgPlotWidth = 3600.000;
const svgPlotHeight = 3600.000;
const svgPlotX = 882.019;
const svgPlotY = 100.780;
const dotColor = "rgba(158,36,123,1)";

const bgcanvas = document.getElementById("bgcanvas");
const bgctx = bgcanvas.getContext("2d");
const canvas = document.getElementById("canvas");
const labelscanvas = document.getElementById("labelscanvas");
const lctx = labelscanvas.getContext("2d");
const ctx = canvas.getContext("2d");
var mainSVG = new Image();
var labelsSVG = new Image();
var canvasWidth, canvasHeight;

var dragged;
var offsetX;
var offsetY;
var mouseIsDown = false;
var lastX = 0;
var lastY = 0;

function handleCanvasMouseDown(e){

  var coords;
	
  // get the current mouse position relative to the canvas
  
  let offsetX = ctx.canvas.getBoundingClientRect().left;
  let offsetY = ctx.canvas.getBoundingClientRect().top;
	
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // save this last mouseX/mouseY

  lastX = mouseX;
  lastY = mouseY;
	
    // Determine which points are going to be dragged
    
    dragged = [];
    
    for (let i = 0; i < currentAngles.length; i++) {
	coords = getCanvasCoords(currentAngles[i][0], currentAngles[i][1]);
	ctx.fillStyle = "rgba(214,77,174,0)";
	ctx.beginPath();
	ctx.arc(coords[0], coords[1], 5, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
	if (ctx.isPointInPath(mouseX, mouseY)) {
		dragged.push(1);
	} else {
		dragged.push(0);
	}
    }

  // set the mouseIsDown flag

  mouseIsDown = true;
}

function handleCanvasMouseUp(e) {
	updateCursorCoords(e);
	updateRamachandran();
	
	let timeout;
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		updateCursorCoords(e);
		updateRamachandran();
		mouseIsDown = false;
		scriptBusy = false;
		dragged = [];
		dragState = 0;
	}, 200);
}

function getDihedralAngles() {
	commands = "set showMeasurements FALSE; ";
	for (let i = 0; i < currentAngles.length; i++) {
		currentResidue = i;
		for (let j = 0; j < 2; j++) {
			if (j == 0) {
				var label = "phi" + i;
				var prompt0 = String(currentResidue) + ".C";
				var prompt1 = String(currentResidue + 1) + ".N";
				var prompt2 = String(currentResidue + 1) + ".CA";
				var prompt3 = String(currentResidue + 1) + ".C";
			} else {
				var label = "psi" + i;			
				var prompt0 = String(currentResidue + 1) + ".N";
				var prompt1 = String(currentResidue + 1) + ".CA";
				var prompt2 = String(currentResidue + 1) + ".C";
				var prompt3 = String(currentResidue + 2) + ".N";
			}
			commands += 'measure ID "' + label + '" " " {' + prompt0 + '} {' + prompt1 + '} {' + prompt2 + '} {' + prompt3 + '};';
		}
	}
	scriptBusy = true;
	commands += "measure LIST;";
	Jmol.script(jmol_intro, commands);
}

function updateDihedrals(targetPhi, targetPsi) {
    var commands, currentResidue, currentAngle, newAngle, rotateAngle, currentLabel;
	if (dragged.length) {
		commands = "";
		
		if (scriptBusy == false && dragState == 0) {
			
			getDihedralAngles();
			
		} else if (scriptBusy == false && dragState == 1) {
		
			for (let i = 0; i < currentAngles.length; i++) {
				currentResidue = i;
				coords = getCanvasCoords(currentAngles[i][0], currentAngles[i][1]);
				if (dragged[i] == 1) {
					//newAngles = getCanvasAngles(coords[0] + (mouseX - lastX), coords[1] + (mouseY - lastY));
					newAngles = [targetPhi, targetPsi];
					
					for (let j = 0; j < 2; j++) {
						if (j == 0) {
							var label = "phi" + i;
							//console.log("Current phi: " + currentAngles[i][j] + ", New phi: " + newAngle + ", Rotating by: " + rotateAngle);
							
							var prompt1 = String(currentResidue + 1) + ".N";
							var prompt2 = String(currentResidue + 1) + ".CA";
						} else {
							var label = "psi" + i;
							//console.log("Current psi: " + currentAngles[i][j] + ", New psi: " + newAngle + ", Rotating by: " + rotateAngle);
							
							var prompt1 = String(currentResidue + 1) + ".CA";
							var prompt2 = String(currentResidue + 1) + ".C";
						}

						introDihedralAngles.forEach((item, index, arr) => {
							if (introDihedralAngles[index][7] == label) {
								currentAngle = Math.round(introDihedralAngles[index][1]);
								currentLabel = introDihedralAngles[index][7];
							}
						});
						
						//console.log("Label: " + currentLabel  + ", Measured angle: " + currentAngle + ", Stored angle: " + currentAngles[currentResidue][j]);
						
						currentAngle = currentAngles[currentResidue][j];
						newAngle = limitAngle(newAngles[j]);
						rotateAngle = newAngle - currentAngle;
						//rotateAngle = 5;
						
						//console.log("Target angle: " + newAngle + ", Rotate by: " + rotateAngle);
						
						commands += 'rotate BRANCH {' + prompt1 + '} {' + prompt2 + '} ' + rotateAngle + ';';
						
						currentAngles[i][j] = newAngle;
						
						// Update selected slider values
						
						const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
						
						if (currentState.isSelected) {
							if (currentState.selectionEnd - currentState.selectionStart == 1) {
								if (i == currentState.selectionStart) {
									selectedPhiVal.innerHTML = currentAngles[i][0];
									selectedPsiVal.innerHTML = currentAngles[i][1];
									document.getElementById("selectedPhiSlider").value = currentAngles[i][0];
									document.getElementById("selectedPsiSlider").value = currentAngles[i][1];
								}
							}
						}
					}
				}
				
			}
			
			scriptBusy = true;
			dragState = 2;
			commands += "measure DELETE;";
			Jmol.script(jmol_intro, commands);
			
		} else if (scriptBusy == false && dragState == 2) {
			
			commands = "";
			commands += getPlanesCommands();
			const checkedRadio = document.querySelector('input[name="clashes"]:checked').value;
			if (checkedRadio == "clashesTrue") {
				commands += getClashesCommands();
			}
			commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
			
			let firstRes = 1;
			let lastRes = currentAngles.length;
			let angles = getAlignmentAngles(jmol_intro, firstRes, lastRes);
			let angleXY = angles[0];
			let angleXZ = angles[1];
			
			// Rotate
			
			commands += 'reset;rotate -z ' + angleXY + ';rotate y ' + angleXZ + ';';
			
			// Recalculate secondary structure assignments
			
			commands += "calculate STRUCTURE ramachandran;";
			commands += getStyleCommands();
			
			scriptBusy = true;
			dragState = 3;
			Jmol.script(jmol_intro, commands);
			
		} else if (scriptBusy == false && dragState == 3) {
			
			introDihedralAngles = [];
			
			//updateRamachandran();
			
			dragState = 0;
		}
	}
}

function updateCursorCoords(e) {
	let offsetX = ctx.canvas.getBoundingClientRect().left;
	let offsetY = ctx.canvas.getBoundingClientRect().top;

	mouseX = parseInt(e.clientX - offsetX);
	mouseY = parseInt(e.clientY - offsetY);

	let targetAngles = getCanvasAngles(mouseX, mouseY);
	let targetPhi = targetAngles[0];
	let targetPsi = targetAngles[1];

	updateDihedrals(targetPhi, targetPsi);
 
	lastX = mouseX;
	lastY = mouseY;
}

function handleCanvasMouseMove(e) {
	if (!mouseIsDown) {
		return;
	}
	
	updateCursorCoords(e);
	updateRamachandran();
}

canvas.onmousedown = function(e){
	handleCanvasMouseDown(e);
}

canvas.onmousemove = function(e){
	handleCanvasMouseMove(e);
}

canvas.onmouseup = function(e){
	handleCanvasMouseUp(e);
}

mainSVG.onload = function() {
	canvasWidth = document.getElementById('ramachandran_div').clientWidth;
	canvasHeight = document.getElementById('ramachandran_div').clientHeight;
	bgcanvas.width = canvasWidth;
	bgcanvas.height = canvasHeight;
	labelscanvas.width = canvasWidth;
	labelscanvas.height = canvasHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	bgctx.drawImage(mainSVG, 0, 0, canvasWidth, canvasHeight);
	
	updateRamachandran();
}
mainSVG.src = "ramachandran.svg";
labelsSVG.src = "labels.svg";

function getCanvasCoords(phi, psi) {
	canvasWidth = document.getElementById('ramachandran_div').clientWidth;
	canvasHeight = document.getElementById('ramachandran_div').clientHeight;
	var normPhi = (phi + 180) / 360;
	var normPsi = (180 - psi) / 360;
	var x = Math.round((svgPlotX + normPhi * svgPlotWidth) / svgPageWidth * canvasWidth);
	var y = Math.round((svgPlotY + normPsi * svgPlotHeight) / svgPageHeight * canvasHeight);
	return [x, y];
}

function getCanvasAngles(x, y) {
	canvasWidth = document.getElementById('ramachandran_div').clientWidth;
	canvasHeight = document.getElementById('ramachandran_div').clientHeight;
	var normPhi = (x / canvasWidth * svgPageWidth - svgPlotX) / svgPlotWidth;
	var normPsi = (y / canvasHeight * svgPageHeight - svgPlotY) / svgPlotHeight;
	var phi = Math.round(normPhi * 360 - 180);
	var psi = Math.round(180 - normPsi * 360);
	return [phi, psi];
}

function arrayUniques(array) {
	let s = new Set(array);
	let a = [...s]
	return a;
}

function arrayUniques2d(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

function limitAngle(angle) {
	var val;
	if (angle > 180) {
		val = 180;
	} else if (angle < -180) {
		val = -180;
	} else {
		val = angle;
	}
	return val;
}

function updateRamachandran() {
	var coords;
	var radius = 2;
	var newAngles;
	
	if (currentAngles.length) {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		for (let i = 0; i < currentAngles.length; i++) {
			// Draw filled circle for residue
			coords = getCanvasCoords(currentAngles[i][0], currentAngles[i][1]);
			ctx.fillStyle = dotColor;
			ctx.beginPath();
			ctx.arc(coords[0], coords[1], 3, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			// Draw outer circle indicating residue is currently selected
			if (currentSelectionIdx == i) {
				ctx.strokeStyle = "rgba(158,36,123,1)";
				ctx.beginPath();
				ctx.arc(coords[0], coords[1], 2 * radius + 1, 0, 2 * Math.PI);
				ctx.closePath();
				ctx.stroke();
			}
		}
		// Indicate overlapping points with numbers
		var overlaps = [];
		var xDist, yDist;
		const minDis = 4 * radius + 1;
		for (let i = 0; i < currentAngles.length; i++) {
			var currentOverlaps = [];
			for (let j = 0; j < currentAngles.length; j++) {
				xDist = Math.abs(currentAngles[i][0] - currentAngles[j][0]);
				yDist = Math.abs(currentAngles[i][1] - currentAngles[j][1]);
				if (xDist < minDis && yDist < minDis) {
					currentOverlaps.push(j);
				}
			}
			overlaps.push(currentOverlaps);
		}
		do {
			var newOverlaps = [];
			for (let i = 0; i < overlaps.length; i++) {
				var currentOverlaps = [];
				for (let j = 0; j < overlaps.length; j++) {
					// Combine any arrays that include current index
					if (overlaps[j].includes(i)) {
						currentOverlaps = currentOverlaps.concat(overlaps[j]);
					}
				}
				// Only keep uniques
				currentOverlaps = arrayUniques(currentOverlaps);
				newOverlaps.push(currentOverlaps);
			}
			overlaps = arrayUniques2d(newOverlaps);
		} while (overlaps.flat().length > currentAngles.length);
		// Calculate centers of clusters
		var centers = [];
		for (let i = 0; i < overlaps.length; i++) {
			var avgPhi = 0;
			var avgPsi = 0;
			for (let j = 0; j < overlaps[i].length; j++) {
				avgPhi += currentAngles[overlaps[i][j]][0];
				avgPsi += currentAngles[overlaps[i][j]][1];
			}
			avgPhi /= overlaps[i].length;
			avgPsi /= overlaps[i].length;
			coords = getCanvasCoords(avgPhi, avgPsi);
			ctx.font = "15px Arial";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "rgba(158,36,123,1)";
			if (overlaps[i].length > 1) {
				ctx.fillText(overlaps[i].length + "×", coords[0] + 3 * radius, coords[1]);
			} else {
				ctx.fillText(currentSequence.charAt(overlaps[i]).toUpperCase(), coords[0] + 3 * radius, coords[1]);
			}
		}
	}
	console.log("Update Ramachandran done.");
}