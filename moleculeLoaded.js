function moleculeLoaded() {
	var view;
	
	for (const [key, value] of Object.entries(currentMeasurementLabels)) {
		currentMeasurementLabels[key] = 0;
	}
	
	pdbID = arguments[3];
	
	if (pdbID.length == 4) {
		console.log(pdbID + " has been loaded!");
		
		if (getValueByKey(moleculeProps, pdbID)["type"].includes("bulge")) {
			var subtypeNumbers = [];
			var prevViews = 0;
			let molecules = Object.keys(filterDictByType(moleculeProps, "bulge"));
			for (let i = 0; i < molecules.length; i++) {
				subtypeNumbers.push(getValueByKey(moleculeProps, molecules[i])["subtype"].length);
			}
			var prevSubtypeNumbers = subtypeNumbers.slice(0, molecules.indexOf(pdbID));
			prevSubtypeNumbers.forEach( num => {
			  prevViews += num;
			});
			view = String(prevViews + currentIDs["bulge"]);
		} else if (getValueByKey(moleculeProps, pdbID)["type"].endsWith("turn")) {
			var currentKey = getValueByKey(moleculeProps, pdbID)["type"];
			var subtypeNumbers = [];
			var prevViews = 0;
			let molecules = Object.keys(filterDictByType(moleculeProps, currentKey));
			for (let i = 0; i < molecules.length; i++) {
				subtypeNumbers.push(getValueByKey(moleculeProps, molecules[i])["subtype"].length);
			}
			var prevSubtypeNumbers = subtypeNumbers.slice(0, molecules.indexOf(pdbID));
			prevSubtypeNumbers.forEach( num => {
			  prevViews += num;
			});
			view = String(prevViews + currentIDs[currentKey]);
		} else {
			view = '0';
		}
		
		setView(pdbID, view);
	}
}

function measurementDone() {
    if (arguments[0] == "jmol_intro") {
	    if (arguments[3] == "measureCompleted") {
		return;
	    }
    } else {
	if (arguments[3] == "measureCompleted") {
		var currentID = arguments[0].split("_")[1];
		var numberResidues = getResNumForTurn(currentID);
		
		//console.log("MEASUREMENT DONE (" + arguments[3] + ")");

		var jmol_current = eval(arguments[0]);
		
		//var currentDiv = "JmolDiv_" + jmol_current._id.split("_")[1];
		//var divWidth = document.getElementById(currentDiv).clientWidth;
		//var fontsize = -2 * numberResidues + Math.round(divWidth / 20);
		var fontsize = -2 * numberResidues + 30;
		
		var currentVal = arguments[arguments.length - 1];
		currentVal = Math.round(currentVal * 10) / 10;
		var div_current = 'JmolDiv_' + currentID;
		var jmolWidth = document.getElementById(div_current).getBoundingClientRect().width;
		var jmolHeight = document.getElementById(div_current).getBoundingClientRect().height;
		
		var y = Math.floor((jmolHeight - fontsize)/ 4);
		var coordinates = [];
		
		// Label positions
		
		var padding = 15;
		var columns = numberResidues - 2;
		if (columns < 2) {columns = 2};
		var currentPadding = Math.round(-10 * numberResidues + 60);
		
		coordinates.push([Math.round(jmolWidth / 2), fontsize]); // Add label at bottom for distance measurement
		
		if (numberResidues == 2) {
			numberResidues = 4;
		}
		
		for (let i = 0; i < columns; i++) {
			currentPadding = (i + 1) - (1 + (columns - 1) / 2);
			if (currentPadding < 0) {
				currentPadding = Math.floor(currentPadding); // Cannot use Math.round here, because -0.5 is rounded towards zero
			} else {
				currentPadding = Math.ceil(currentPadding);
			}
			currentPadding *= padding;
			coordinates.push([currentPadding + Math.round(jmolWidth / (columns + 1)) * (i + 1), Math.round(jmolHeight - fontsize)]);
			if (numberResidues > 3) {
				coordinates.push([currentPadding + Math.round(jmolWidth / (columns + 1)) * (i + 1), Math.round(jmolHeight - 3 * fontsize)]);
			}
		}
		
		//Jmol.script(jmol_current, "set measurementLabels OFF;") // Turn off automatic measurement labels
		
		var measurementInfo = arguments[1].substring(1, arguments[1].length - 1).split(",");;
		
		var atomSelections = measurementInfo.map(item => item.trim().split(" ")[0]).slice(0, -1);
		var label = measurementInfo[measurementInfo.length - 1].trim() + " = " + currentVal;
		if (atomSelections.length == 2) {
			label += " Å";
		} else if (atomSelections.length == 4) {
			label += "°";
		}

		var currentSelection = atomSelections.slice(atomSelections.length / 2 - 1, atomSelections.length / 2 + 1).join(" OR ");
		currentMeasurementLabels[currentID] += 1;
		var currentLabelID = "myecho" + currentMeasurementLabels[currentID];
		
		//set echo ID " + currentLabelID + " POINT {" + currentSelection + "}; // XXX POINT currently not working!
		//set echo ID " + currentLabelID + " {" + currentSelection + "};
		//set echo ID " + currentLabelID + " " + coordinates[currentMeasurementLabels[currentID] - 1][0] + " " + coordinates[currentMeasurementLabels[currentID] - 1][1] + ";
		Jmol.script(jmol_current, "font ECHO " + fontsize + "; set echo ID " + currentLabelID + " center; set echo ID " + currentLabelID + " " + coordinates[currentMeasurementLabels[currentID] - 1][0] + " " + coordinates[currentMeasurementLabels[currentID] - 1][1] + "; background ECHO white; color ECHO [158,36,123]; echo " + label + ";");
	}
    }
}

function spinAroundAxis(jmol_current, firstRes, lastRes, chain1, chain2) {
	Jmol.script(jmol_current, "rotate spin {chain = " + chain1 + " and resno = " + firstRes + "} {chain = " + chain2 + " and resno = " + lastRes + "} 5;");
}

function calcHBonds(mode = "rasmol") {
	if (mode == "rasmol") {
		return "set hbondsRasmol TRUE;hbonds calculate;";
	} else if (mode == "jmol") {
		return "set hbondsRasmol False;set hbondsAngleMinimum 80;set hbondsDistanceMaximum 3.5;hbonds calculate;";
	}
}

function getResNumForTurn(key){
	switch(key) {
		case 'piturn':
		return 6;
		break;
		case 'alphaturn':
		return 5;
		break;
		case 'betaturn':
		return 4;
		break;
		case 'gammaturn':
		return 3;
		break;
		case 'epsilonturn':
		return 3;
		break;
		case 'deltaturn':
		return 2;
		break;
	}
}

function getSelectionString(residues, chains) {
	var selections = [];
	var residuesList = [], residuesStrings = [];
	
	for (let i = 0; i < chains.length; i++) {
		selections.push("(resno>=" + residues[i][0] + " and resno<=" + residues[i][1] + " and chain=" + chains[i][0] + ")");
		residuesList.push([residues[i][0], residues[i][1]]);
	}
	
	var residuesString = "";
	for (let i = 0; i < residuesList.length; i++) {
		residuesStrings.push(residues[i].join(" to ") + " ");
	}
	residuesString = residuesStrings.join(" and ");
	//console.log("Selecting " + residuesString);
	
	var currentSelection = selections.join(" or ");
	return currentSelection;
}

function onlySelectionOpaque(jmol_current, residues, chains) {
	var currentSelection = "(" + getSelectionString(residues, chains) + ") and atomName=CA";
	//console.log("Making opaque " + residuesString);
	
	currentSelection = "{" + currentSelection + "}";
	
	Jmol.script(jmol_current, "select all;color cartoons TRANSLUCENT 0.9 [158,36,123];");
	Jmol.script(jmol_current, "select " + currentSelection + ";color cartoons OPAQUE;");
}

function getAlignmentAngles(jmol_input, firstRes, lastRes, chain1 = "", chain2 = "") {
	//if (chain1 != "" && chain2 != "") {
	//	console.log("Aligning to atom pair including residues " + firstRes + " to " + lastRes + " in chains " + chain1 + " and " + chain2);
	//}
	
	// https://sourceforge.net/p/jmol/mailman/jmol-users/thread/46721C8A.3070709@stolaf.edu/

	var prompt1 = "resno=" + firstRes + " and atomName=CA";
	var prompt2 = "resno=" + lastRes + " and atomName=CA";

	if (chain1 != "") {prompt1 += " and chain=" + chain1};
	if (chain2 != "") {prompt2 += " and chain=" + chain2};
	
	var properties1 = Jmol.getPropertyAsArray(jmol_input, "atomInfo", prompt1);
	var properties2 = Jmol.getPropertyAsArray(jmol_input, "atomInfo", prompt2);
	
	var atom1 = properties1[0];
	var atom2 = properties2[0];
	
	// Get angle for rotation around z axis

	let vectorCoords = [atom2.x - atom1.x, atom2.y - atom1.y, atom2.z - atom1.z];
	let projectCoords = [vectorCoords[0], vectorCoords[1], 0];
	let angleXY = 180 / Math.PI * Math.atan2(vectorCoords[1], vectorCoords[0]);
	
	// Get angle for rotation around y axis
	
	let dist = Math.sqrt(Math.pow(atom2.x - atom1.x, 2) + Math.pow(atom2.y - atom1.y, 2));
	let angleXZ = 180 / Math.PI * Math.atan2(atom2.z - atom1.z, dist);
	
	return [angleXY, angleXZ];
}

function getAlignmentCommands(jmol_input, firstRes, lastRes, chain1 = "", chain2 = "") {
	let angles = getAlignmentAngles(jmol_input, firstRes, lastRes, chain1, chain2);
	let angleXY = angles[0];
	let angleXZ = angles[1];
	let commands = "";
	
	// Rotate
	
	commands += 'set refreshing false;reset;rotate -z ' + angleXY + ';rotate y ' + angleXZ + ';';
	
	// Zoom in
	
	if (chain1 != "" && chain2 != "") {
		if (chain1 == chain2) {
			currentSelection = "{(resno>=" + firstRes + " and resno<=" + lastRes + " and chain=" + chain1 + " and atomName=CA)}";
		} else {
			currentSelection = "{(resno>=" + firstRes + " and chain=" + chain1 + " and atomName=CA) or (resno<=" + lastRes + " and chain=" + chain2 + " and atomName=CA)}";
		}
	}
	
	commands += 'zoom ' + currentSelection + ' 0;set refreshing true;';
	
	return commands;
}

function alignToAtomPair(jmol_input = jmol_current, firstRes, lastRes, chain1 = "", chain2 = "") {
	let angles = getAlignmentAngles(jmol_input, firstRes, lastRes, chain1, chain2);
	let angleXY = angles[0];
	let angleXZ = angles[1];
	
	// Rotate
	
	Jmol.script(jmol_input, "set refreshing false;reset;rotate -z " + angleXY + ";rotate y " + angleXZ + ";");
	
	// Zoom in
	
	if (chain1 != "" && chain2 != "") {
		if (chain1 == chain2) {
			currentSelection = "{(resno>=" + firstRes + " and resno<=" + lastRes + " and chain=" + chain1 + " and atomName=CA)}";
		} else {
			currentSelection = "{(resno>=" + firstRes + " and chain=" + chain1 + " and atomName=CA) or (resno<=" + lastRes + " and chain=" + chain2 + " and atomName=CA)}";
		}
	}
	
	Jmol.script(jmol_input, "zoom " + currentSelection + " 0;set refreshing true;");
}