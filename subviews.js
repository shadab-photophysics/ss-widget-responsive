function distorted(change) {
	let molecules = Object.keys(filterDictByType(moleculeProps, "distorted"));
	var loadMoleculeIdx;
	if (change == 0) {
		loadMoleculeIdx = 0;
	} else {
		var props = Jmol.getPropertyAsArray(jmol_distorted, "auxiliaryInfo");
		currentMolecule = props.models[0].modelName;
		if (molecules.includes(currentMolecule)) {
			currentIdx = molecules.indexOf(currentMolecule);
			if (currentIdx + change >= molecules.length) {
				loadMoleculeIdx = 0;
			} else if (currentIdx + change < 0) {
				loadMoleculeIdx = molecules.length - 1;
			} else {
				loadMoleculeIdx = currentIdx + change;
			}
		} else {
			loadMoleculeIdx = 0;
		}
	}
	Jmol.script(jmol_distorted, "set disablePopupMenu TRUE;frank off;set perspectiveDepth off;load " + molecules[loadMoleculeIdx] + ".pdb;cartoon only;set cartoonFancy on;color [158,36,123];");
	document.getElementById("PDB_ID_distorted").textContent = "PDB ID: " + molecules[loadMoleculeIdx];
	document.getElementById("caption_distorted").innerHTML = moleculeProps[molecules[loadMoleculeIdx]]["caption"];
}

function turn(change, type) {
	console.log(type.toUpperCase() + " CHANGE...");
	
	var jmol_current = eval("jmol_" + type);
	var newKeyIdx, newSubtypeIdx;
	let molecules = Object.keys(filterDictByType(moleculeProps, type));
	if (change == 0) {
		newKeyIdx = 0;
		newSubtypeIdx = 0;
	} else {
		var subtypeNumbers = [];
		var newKeyIdx, newSubtypeIdx;
		for (let i = 0; i < molecules.length; i++) {
			subtypeNumbers.push(getValueByKey(moleculeProps, molecules[i])["subtype"].length);
		}
		var props = Jmol.getPropertyAsArray(jmol_current, "auxiliaryInfo");
		const currentKey = props.models[0].modelName;
		
		var currentKeyIdx, currentSubtypeIdx, viewIdx;
		if (molecules.includes(currentKey)) {
			currentKeyIdx = molecules.indexOf(currentKey);
			currentSubtypeIdx = currentIDs[type];
			if (change == -1) {
				console.log("Previous view.");
				if (subtypeNumbers[currentKeyIdx] > 1 && currentSubtypeIdx > 0) {
					newKeyIdx = currentKeyIdx;
					newSubtypeIdx = currentSubtypeIdx - 1;
				} else {
					if (currentKeyIdx - 1 < 0) {
						newKeyIdx = molecules.length - 1;
						newSubtypeIdx = subtypeNumbers[newKeyIdx] - 1;
					} else {
						newKeyIdx = currentKeyIdx - 1;
						newSubtypeIdx = subtypeNumbers[currentKeyIdx - 1] - 1;
					}
				}
			} else if (change == 1) {
				console.log("Next view.");
				if (subtypeNumbers[currentKeyIdx] > 1 && currentSubtypeIdx < subtypeNumbers[currentKeyIdx] - 1) {
					newKeyIdx = currentKeyIdx;
					newSubtypeIdx = currentSubtypeIdx + 1;
				} else {
					if (currentKeyIdx + 1 > molecules.length - 1) {
						newKeyIdx = 0;
						newSubtypeIdx = 0;
					} else {
						newKeyIdx = currentKeyIdx + 1;
						newSubtypeIdx = 0;
					}
				}
			}
		} else {
			newKeyIdx = 0;
			newSubtypeIdx = 0;
		}
	}
	currentIDs[type] = newSubtypeIdx;
	Jmol.script(jmol_current, "set disablePopupMenu TRUE;frank off;set perspectiveDepth off;load " + molecules[newKeyIdx] + ".pdb;cartoon only;set cartoonFancy on;color [158,36,123];");
	let molecule = getValueByKey(moleculeProps, molecules[newKeyIdx]);
	document.getElementById(type + "_type").innerHTML = molecule["subtype"][newSubtypeIdx];
	document.getElementById("PDB_ID_" + type).innerHTML =  "(PDB ID: " + molecules[newKeyIdx] + ")";
	document.getElementById("caption_" + type).innerHTML = molecule["caption"][newSubtypeIdx];
}

function bulge(change) {
	console.log("BULGE CHANGE..");
	let molecules = Object.keys(filterDictByType(moleculeProps, "bulge"));
	if (change == 0) {
		newKeyIdx = 0;
		newSubtypeIdx = 0;
	} else {
		var subtypeNumbers = [];
		var newKeyIdx, newSubtypeIdx;
		for (let i = 0; i < molecules.length; i++) {
			subtypeNumbers.push(getValueByKey(moleculeProps, molecules[i])["subtype"].length);
		}
		var props = Jmol.getPropertyAsArray(jmol_bulge, "auxiliaryInfo");
		const currentKey = props.models[0].modelName;
		
		var currentKeyIdx, currentSubtypeIdx, viewIdx;
		if (molecules.includes(currentKey)) {
			currentKeyIdx = molecules.indexOf(currentKey);
			currentSubtypeIdx = currentIDs["bulge"];
			if (change == -1) {
				console.log("Previous view.");
				if (subtypeNumbers[currentKeyIdx] > 1 && currentSubtypeIdx > 0) {
					newKeyIdx = currentKeyIdx;
					newSubtypeIdx = currentSubtypeIdx - 1;
				} else {
					if (currentKeyIdx - 1 < 0) {
						newKeyIdx = molecules.length - 1;
						newSubtypeIdx = subtypeNumbers[newKeyIdx] - 1;
					} else {
						newKeyIdx = currentKeyIdx - 1;
						newSubtypeIdx = subtypeNumbers[currentKeyIdx - 1] - 1;
					}
				}
			} else if (change == 1) {
				console.log("Next view.");
				if (subtypeNumbers[currentKeyIdx] > 1 && currentSubtypeIdx < subtypeNumbers[currentKeyIdx] - 1) {
					newKeyIdx = currentKeyIdx;
					newSubtypeIdx = currentSubtypeIdx + 1;
				} else {
					if (currentKeyIdx + 1 > molecules.length - 1) {
						newKeyIdx = 0;
						newSubtypeIdx = 0;
					} else {
						newKeyIdx = currentKeyIdx + 1;
						newSubtypeIdx = 0;
					}
				}
			}
		} else {
			newKeyIdx = 0;
			newSubtypeIdx = 0;
		}
	}
	currentIDs["bulge"] = newSubtypeIdx;
	Jmol.script(jmol_bulge, "set disablePopupMenu TRUE;frank off;set perspectiveDepth off;load " + molecules[newKeyIdx] + ".pdb;cartoon only;set cartoonFancy on;color [158,36,123];");
	let molecule = getValueByKey(moleculeProps, molecules[newKeyIdx]);
	document.getElementById("bulge_type").innerHTML = molecule["subtype"][newSubtypeIdx];
	document.getElementById("PDB_ID_bulge").innerHTML =  "(PDB ID: " + molecules[newKeyIdx] + ")";
	document.getElementById("caption_bulge").innerHTML = molecule["caption"][newSubtypeIdx];
}

function filterDictByType(dict, type) {
	var newDict = {};
	for (const [key, value] of Object.entries(dict)) {
		if (dict[key]["type"] == type) {
			newDict[key] = value;
		}
	}
	return newDict;
}