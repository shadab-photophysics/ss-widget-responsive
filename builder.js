var clashes = false;
var currentSequence = "";
var currentAngles = [];
var movedAngles = [];
var currentSelection = null;
var currentSelectionIdx = null;
var newPhiVal = document.getElementById("newPhiVal");
var newPsiVal = document.getElementById("newPsiVal");
var newOmegaVal = document.getElementById("newOmegaVal");
var newPhi = parseInt(document.getElementById("newPhiSlider").defaultValue);
var newPsi = parseInt(document.getElementById("newPsiSlider").defaultValue);
var newOmega = parseInt(document.getElementById("newOmegaSlider").defaultValue);
newPhiVal.innerHTML = newPhi;
newPsiVal.innerHTML = newPsi;
newOmegaVal.innerHTML = newOmega;
var selectedPhiVal = document.getElementById("selectedPhiVal");
var selectedPsiVal = document.getElementById("selectedPsiVal");
var selectedOmegaVal = document.getElementById("selectedOmegaVal");

var newPhiValSlider = document.getElementById("newPhiSlider");

newPhiValSlider.oninput = function() {
	newPhi = parseInt(this.value);
	newPhiVal.innerHTML = newPhi;
}

var newPsiValSlider = document.getElementById("newPsiSlider");

newPsiValSlider.oninput = function() {
	newPsi = parseInt(this.value);
	newPsiVal.innerHTML = newPsi;
}

var newOmegaValSlider = document.getElementById("newOmegaSlider");

newOmegaValSlider.oninput = function() {
	newOmega = parseInt(this.value);
	newOmegaVal.innerHTML = newOmega;
}

var selectedPhiValSlider = document.getElementById("selectedPhiSlider");

selectedPhiValSlider.oninput = function() {
	var commands = "";
	const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
	const currentResidue = currentState.selectionStart;
	var newAngle = parseInt(this.value);
	selectedPhiVal.innerHTML = newAngle;
	var currentAngle = currentAngles[currentResidue][0];
	var rotateAngle = newAngle - currentAngle;
	commands += 'rotate BRANCH {' + String(currentResidue + 1) + '.N} {' + String(currentResidue + 1) + '.CA} ' + rotateAngle + ';';
	commands += getPlanesCommands();
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	if (checkedRadio == "ballstick") {
		commands += getClashesCommands();
	}
	commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
	Jmol.script(jmol_intro, commands);
	currentAngles[currentResidue][0] = newAngle;
	updateRamachandran();
}

var selectedPsiValSlider = document.getElementById("selectedPsiSlider");

selectedPsiValSlider.oninput = function() {
	var commands = "";
	const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
	const currentResidue = currentState.selectionStart;
	var newAngle = parseInt(this.value);
	selectedPsiVal.innerHTML = newAngle;
	var currentAngle = currentAngles[currentResidue][1];
	var rotateAngle = newAngle - currentAngle;
	commands += 'rotate BRANCH {' + String(currentResidue + 1) + '.CA} {' + String(currentResidue + 1) + '.C} ' + rotateAngle + ';';
	commands += getPlanesCommands();
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	if (checkedRadio == "ballstick") {
		commands += getClashesCommands();
	}
	commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
	Jmol.script(jmol_intro, commands);
	currentAngles[currentResidue][1] = newAngle;
	updateRamachandran();
}

var selectedOmegaValSlider = document.getElementById("selectedOmegaSlider");

selectedOmegaValSlider.oninput = function() {
	var commands = "";
	const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
	const currentResidue = currentState.selectionStart;
	var newAngle = parseInt(this.value);
	selectedOmegaVal.innerHTML = newAngle;
	var currentAngle = currentAngles[currentResidue][2];
	var rotateAngle = newAngle - currentAngle;
	commands += 'rotate BRANCH {' + String(currentResidue + 1) + '.C} {' + String(currentResidue + 2) + '.N} ' + rotateAngle + ';';
	commands += getPlanesCommands();
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	if (checkedRadio == "ballstick") {
		commands += getClashesCommands();
	}
	commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
	Jmol.script(jmol_intro, commands);
	currentAngles[currentResidue][2] = newAngle;
}

function buttonClick(buttonID) {
	var firstAtom, secondAtom, angleIDX, newAngle;
	switch (buttonID) {
		case 'phiButton':
			firstAtom = 'N';
			secondAtom = 'CA';
			angleIDX = 0;
			newAngle = parseInt(newPhiValSlider.value);
		break;
		case 'psiButton':
			firstAtom = 'CA';
			secondAtom = 'C';
			angleIDX = 1;
			newAngle = parseInt(newPsiValSlider.value);
		break;
		case 'omegaButton':
			firstAtom = 'C';
			secondAtom = 'N';
			angleIDX = 2;
			newAngle = parseInt(newOmegaValSlider.value);
		break;
	}
	var commands = "";
	const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
	
	var currentAngle, rotateAngle;
	for (let i = currentState.selectionStart; i < currentState.selectionEnd; i++) {
		currentAngle = currentAngles[i][angleIDX];
		rotateAngle = newAngle - currentAngle;
		commands += 'rotate BRANCH {' + String(i + 1) + '.' + firstAtom + '} {' + String(i + 1) + '.' + secondAtom + '} ' + rotateAngle + ';';
		currentAngles[i][angleIDX] = newAngle;
	}
	commands += getPlanesCommands();
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	if (checkedRadio == "ballstick") {
		commands += getClashesCommands();
	}
	commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
	commands += "calculate STRUCTURE ramachandran;";
	commands += getStyleCommands();
	Jmol.script(jmol_intro, commands);
}

function commitSequenceChanges() {
	//console.log("Comitting sequence changes.");
	
	var changeRange, changeType, changedSeq, changedAng, moveAngles;
	var newSequence = currentSequence;
	var newAngles = currentAngles;
	var anglesStart, anglesEnd;
	var temporaryAngles, temporaryAngles2;
	
	for (let i = 0; i < sequenceChanges.length; i++) {
		temporaryAngles = [];
		temporaryAngles2 = [];
		changeRange = sequenceChanges[i][0];
		changeType = sequenceChanges[i][1];
		changedSeq = sequenceChanges[i][2];
		moveAngles = sequenceChanges[i][3];
		if (changeType > 0) { // Insertion
			//console.log("INSERTION");
			const initAngles = [newPhi, newPsi, newOmega];
			newSequence = newSequence.slice(0, changeRange[0]) + changedSeq + newSequence.slice(changeRange[0]);

			if (movedAngles.length) { // If angle information is going to be inserted as part of movement, retrieve it first
				changedAng = movedAngles;
				movedAngles = [];
			} else {
				changedAng = [initAngles];
			}
			
			temporaryAngles.push(newAngles.slice(0, changeRange[0]));
			temporaryAngles.push(changedAng);
			temporaryAngles.push(newAngles.slice(changeRange[0]));
			temporaryAngles = temporaryAngles.flat();
			newAngles = temporaryAngles;
		} else if (changeType == 0) { // Replacement
			//console.log("REPLACEMENT");
			const initAngles = [newPhi, newPsi, newOmega];
			newSequence = newSequence.slice(0, changeRange[0]) + newSequence.slice(changeRange[1]);
			newSequence = newSequence.slice(0, changeRange[0]) + changedSeq + newSequence.slice(changeRange[0]);
			
			temporaryAngles.push(newAngles.slice(0, changeRange[0]));
			temporaryAngles.push(newAngles.slice(changeRange[1]));
			temporaryAngles = temporaryAngles.flat();
			temporaryAngles2.push(temporaryAngles.slice(0, changeRange[0]));
			temporaryAngles2.push([initAngles]);
			temporaryAngles2.push(temporaryAngles.slice(changeRange[0]));
			temporaryAngles2 = temporaryAngles2.flat();
			newAngles = temporaryAngles2;
		} else if (changeType < 0) { // Deletion
			//console.log("DELETION");
			newSequence = newSequence.slice(0, changeRange[0]) + newSequence.slice(changeRange[1]);
			
			if (moveAngles == true) { // If angle information is going to be deleted as part of movement, store it first
				movedAngles = newAngles.slice(changeRange[0], changeRange[1]);
			}
			
			temporaryAngles.push(newAngles.slice(0, changeRange[0]));
			temporaryAngles.push(newAngles.slice(changeRange[1]));
			temporaryAngles = temporaryAngles.flat();
			newAngles = temporaryAngles;
		}
	}
	
	//console.log("currentSequence: " + currentSequence + ", newSequence: " + newSequence);
	
	var commands = "zap;";
	
	const phiPsiOnly = newAngles.map(item => item.slice(0, 2)).flat();
	
	if (newSequence.length == 1) { // First residue created
		//console.log("First residue created.");
		commands +=  'mutate CREATE ALA [' + phiPsiOnly.toString() + '];'; // Somehow, can't create a single amino acid other than alanine
	} else if (newSequence.length > 0) { // Single residue inserted
		commands +=  'mutate CREATE ' + newSequence + ' [' + phiPsiOnly.toString() + '];';
	}
	currentSequence = newSequence;
	currentAngles = newAngles;
	commands += 'reset;zoomto 0 {all};zoom 100;';
	
	if (newSequence.length == 2) { // Somehow, if this is not done, the last residue is not connected to the rest of the peptide
		commands += 'connect 1.0 1.64 (_N) (_C) SINGLE CREATE;rotate z 35;';
	} else if (newSequence.length > 2) {
		commands += 'connect 1.0 1.64 (_N) (_C) SINGLE CREATE;rotate z -35;rotate y 90;';
	}
	
	commands += getPlanesCommands();
	
	commands += 'select {backbone};' + calcHBonds() + 'color hbonds [247,148,36];hbonds 0.1;';
	
	commands += getStyleCommands();
	
	commands += 'script postLoadingScript.txt;';
	
	//console.log("Executing: " + commands);
	Jmol.script(jmol_intro, commands);
	
	sequenceChanges = [];
	
	commands = "";
	
	if (currentSequence.length % 2 == 0) {
		commands += 'rotate x 180;';
	}
	
	if (newSequence.length == 1) { // Doesn't work if attempted earlier.
		commands += 'rotate z -30;mutate 1 ' + newSequence + ';';
	} else if (newSequence.length == 2) {
		commands += 'rotate z 35;';
	}
	
	Jmol.script(jmol_intro, commands);
	
	var targetOmega, changeOmega;
	
	// Update omegas
	commands = "";
	for (let i = 0; i < currentSequence.length - 1; i++) {
		// Get target omega
		targetOmega = currentAngles[i][2];
		// Calcualte difference between current value (always 180° after new creation) and target value
		changeOmega = targetOmega - 180;
		// Change angle accordingly
		commands += 'rotate BRANCH {' + String(i + 1) + '.C} {' + String(i + 2) + '.N} ' + changeOmega + ';';
	}
	
	//console.log("Executing: " + commands);
	Jmol.script(jmol_intro, commands);
	
	styleChange();
	
	updateRamachandran();
}

// XXX Must investigate bug: If showing planes and then changing dihedral angles, last residue won't move! Somehow related to draw ramachandran!

function getPlanesCommands() {
	var commands = "delete $*;";
	
	const checkedRadio = document.querySelector('input[name="anglePlanes"]:checked').value;
	
	switch (checkedRadio) {
		case 'phi':
		// Draw phi planes
		//commands += 'draw RAMACHANDRAN;draw ID "plane*" off;draw ID "psi_*" off;';
		for (let i = 2; i <= currentSequence.length; i++) {
			commands += 'draw phiA' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + String(i - 1) + '.C) (' + i + '.N) (' + i + '.CA);draw phiB' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + i + '.N) (' + i + '.CA) (' + i + '.C);';
			//commands += 'draw ID "phi_0_' + i + '_32" color [158,36,123] TITLE "";';
		}
		break;
		case 'psi':
		// Draw psi planes
		//commands += 'draw RAMACHANDRAN;draw ID "plane*" off;draw ID "phi_*" off;';
		for (let i = 1; i < currentSequence.length; i++) {
			commands += 'draw psiA' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + i + '.N) (' + i + '.CA) (' + i + '.C);draw psiB' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + i + '.CA) (' + i + '.C) (' + String(i + 1) + '.N);';
			//commands += 'draw ID "psi_0_' + i + '_32" color [158,36,123] TITLE "";';
		}
		break;
		case 'omega':
		// Draw omega planes
		for (let i = 1; i < currentSequence.length; i++) {
			commands += 'draw omegaA' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + i + '.CA) (' + i + '.C) (' + String(i + 1) + '.N);draw omegaB' + i + ' color TRANSLUCENT 0.5 [158,36,123] (' + i + '.C) (' + String(i + 1) + '.N) (' + String(i + 1) + '.CA);';
		}
		break;
		default:
	}
	return commands;
}

function getBondsCommands() {
	var commands = "select all;color BONDS none;select none;";
	
	const checkedRadio = document.querySelector('input[name="angleBonds"]:checked').value;
	
	switch (checkedRadio) {
		case 'phi':
		// Color phi bonds
		for (let i = 1; i <= currentSequence.length; i++) {
			commands += 'select ADD (' + String(i) + '.N) or (' + i + '.CA);';
		}
		break;
		case 'psi':
		// Color psi bonds
		for (let i = 1; i <= currentSequence.length; i++) {
			commands += 'select ADD (' + i + '.CA) or (' + i + '.C);';
		}
		break;
		case 'omega':
		// Color omega bonds
		for (let i = 1; i < currentSequence.length; i++) {
			commands += 'select ADD (' + i + '.C) or (' + String(i + 1) + '.N);';
		}
		break;
		default:
			commands += 'select all;color BONDS none;';
	}
	if (checkedRadio != 'hide') {
		commands += 'color BONDS [158,36,123];';
	}
	return commands;
}

function clashesChange() {
	const checkedRadio = document.querySelector('input[name="clashes"]:checked').value;
	switch (checkedRadio) {
		case 'true':
			clashes = true;
		break;
		case 'false':
			clashes = false;
		break;
	}
	Jmol.script(jmol_intro, getClashesCommands());
}

function labelsChange() {
	const checkedRadio = document.querySelector('input[name="labels"]:checked').value;
	switch (checkedRadio) {
		case 'true':
			lctx.clearRect(0, 0, canvasWidth, canvasHeight);
			lctx.drawImage(labelsSVG, 0, 0, canvasWidth, canvasHeight);
		break;
		case 'false':
			lctx.clearRect(0, 0, canvasWidth, canvasHeight);
		break;
	}
}

function anglePlanesChange() {
	Jmol.script(jmol_intro, getPlanesCommands());
}

function angleBondsChange() {
	Jmol.script(jmol_intro, getBondsCommands());
}

function getStyleCommands() {
	var commands = "";
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	
	switch (checkedRadio) {
		case 'ballstick':
			commands += 'select {all};wireframe only;wireframe reset;spacefill reset;';
			commands += getClashesCommands();
		break;
		case 'cartoon':
			commands += 'select {all};cartoon only;set cartoonFancy on;color cartoon [158,36,123];';
			commands += 'contact delete;';
		break;
		default:
	}
	return commands;
}

function styleChange() {
	const checkedRadio = document.querySelector('input[name="style"]:checked').value;
	switch (checkedRadio) {
		case 'ballstick':
			document.getElementById("clashesTrue").removeAttribute("disabled");
			document.getElementById("clashesFalse").removeAttribute("disabled");
		break;
		case 'cartoon':
			document.getElementById("clashesTrue").setAttribute("disabled","disabled");
			document.getElementById("clashesFalse").setAttribute("disabled","disabled");
			document.getElementById("clashesTrue").checked = false;
			document.getElementById("clashesFalse").checked = true;
			clashes = false;
		break;
		default:
	}
	Jmol.script(jmol_intro, getStyleCommands());
}

function getClashesCommands() {
	var commands = "contact delete;";
	if (clashes == true) {
		for (let i = 1; i < currentSequence.length; i++) {
			// Only considering clashes between subsequent residues of the backbone excluding N and C of peptide bonds
			// commands += 'contact ID clashes' + i + 'next {resno=' + i + ' and not *.C and not sidechain} {resno=' + String(i + 1) + ' and not *.N and not sidechain} -0.3 full;'; // Get clashes with next subsequent residue
			// Only considering clashes between subsequent residues excluding N and C of peptide bonds
			commands += 'contact ID clashes' + i + 'next {resno=' + i + ' and not *.C} {resno=' + String(i + 1) + ' and not *.N} -0.3 full;'; // Get clashes with next subsequent residue
		}
	}
	return commands;
}

function storeSequenceChanges(evt) {
	//console.log("Storing sequence changes.");
	
	Jmol.script(jmol_intro, 'script preLoadingScript.txt;');
	
	const initAngles = [newPhi, newPsi, newOmega];
	const t = evt.target;
	var changeRange = null; // Position starts at 1
	var changeType = null;
	var changedSeq = null;
	var moveAngles = false;
	var charAdded = null;
	var newSequence = null;
	var commands = "";
	const charPressed = String.fromCharCode(evt.keyCode).toLowerCase();

	const currentState = { ...textSelectionStorage.get(document.getElementById("sequence")) };
	if (evt.type == 'keydown') {
		if (evt.keyCode === 8 || evt.keyCode === 46) { // Deletion of some sort
			changeType = -1;
			if (currentState.isSelected == true) { // Deletion of selection
				changeRange = [currentState.selectionStart, currentState.selectionEnd];
				changedSeq = currentState.selection;
			} else {
				if (evt.keyCode === 8) { // Single deletion with backspace key
					changeRange = [t.selectionStart - 1, t.selectionStart];
					changedSeq = t.value[t.selectionStart - 1];
				} else if (evt.keyCode === 46) { // Single deletion with delete key
					changeRange = [t.selectionStart, t.selectionStart + 1];
					changedSeq = t.value[t.selectionStart];
				}
			}
		} else if (evt.keyCode >= 65 && evt.keyCode <= 89) { // Entry of single letter amino acid codes
			if (currentState.isSelected == true) { // Replacement of some sort
				changeType = 0;
				changeRange = [currentState.selectionStart, currentState.selectionEnd];
				changedSeq = charPressed;
			} else { // Addition
				changeType = 1;
				changeRange = [t.selectionStart, t.selectionStart];
				changedSeq = charPressed;
			}
		}
	} else if (evt.type == 'dragstart') {
		changeType = -1;
		changeRange = [currentState.selectionStart, currentState.selectionEnd];
		changedSeq = currentState.selection;
		moveAngles = true;
	} else if (evt.type == 'dragend') {
		changeType = 1;
		changeRange = [currentState.selectionStart, currentState.selectionStart];
		changedSeq = currentState.selection;
	}
	sequenceChanges.push([changeRange, changeType, changedSeq, moveAngles]);
}

function sequenceInitialise() {
	Jmol.script(jmol_intro, 'script preLoadingScript.txt;');
	var changeRange = null; // Position starts at 1
	var changeType = null;
	var changedSeq = null;
	var moveAngles = false;
	const startSequence = document.getElementById("sequence").defaultValue;
	for (let i = 0; i < startSequence.length; i++) {
		changeType = 1;
		changeRange = [i, i];
		changedSeq = startSequence.charAt(i);
		sequenceChanges.push([changeRange, changeType, changedSeq, moveAngles]);
	}
	commitSequenceChanges();
}

// Taken from:
// https://stackoverflow.com/questions/70900476/how-to-detect-the-deselection-of-a-before-selected-text

// gather all text control related selection data and put it
// into an object based (here the element reference) storage.
function putTextSelectionState(textControl) {
  const { value, selectionStart, selectionEnd } = textControl;

  const isSelected = (selectionEnd - selectionStart >= 1);
  const selection = value.substring(selectionStart, selectionEnd);

  textSelectionStorage.set(textControl, {
    isSelected,
    selection,
    selectionStart,
    selectionEnd,
    value,
  });
}
// the object based storage.
const textSelectionStorage = new WeakMap;

// detect whether custom 'deselect' event handling has to take place.
function handleDeselectText(evt) {
  const textControl = evt.currentTarget;
  const { selectionStart, selectionEnd } = textControl;

  const recentState = { ...textSelectionStorage.get(textControl) };
  putTextSelectionState(textControl);
  const currentState = { ...textSelectionStorage.get(textControl) };

  if (
    (selectionEnd - selectionStart === 0)
    && recentState.isSelected
  ) {

    // a custom event will be created and dispatched in case ...
    // - there is nothing currently selected ... and ...
    // - there was a recent selection right before.
    textControl
      .dispatchEvent(
        new CustomEvent('deselect', {
          detail: {
            recentState,
            currentState,
          },
        })
      );
  }  
}
// update text control related selection data.
function handleSelectText({ currentTarget }) {
  putTextSelectionState(currentTarget);
}

// enable text related, custom 'deselect' event handling.
function initializeHandleDeselectText(textControl) {
  const nodeName = textControl.nodeName.toLowerCase();
  const textType = ((nodeName === 'input') && textControl.type) || null;

  if (textType === 'text') {
    putTextSelectionState(textControl);

    textControl.addEventListener('select', handleSelectText);

    textControl.addEventListener('input', handleDeselectText);
    textControl.addEventListener('keyup', handleDeselectText);
    textControl.addEventListener('mouseup', handleDeselectText);
    textControl.addEventListener('focusout', handleDeselectText); 
  }
}

// custom 'deselect' event handling.
function logTextDeselection(evt) {
  const { type, detail, currentTarget } = evt;

  currentSelection = null;
  currentSelectionIdx = null;
  //console.log("Selection removed.");
  
  document.getElementById("selectedAngles").style.display = "none";
  document.getElementById("selectedOmegaAngle").style.display = "none";
  document.getElementById("phiButton").setAttribute("disabled","disabled");
  document.getElementById("psiButton").setAttribute("disabled","disabled");
  document.getElementById("omegaButton").setAttribute("disabled","disabled");
  
  //Jmol.script(jmol_intro, "dots OFF;");
  Jmol.script(jmol_intro, "select all;halos OFF;");
  
  updateRamachandran();
}

// native 'select' event handling.
function logTextSelection(evt) {
  const textControl = evt.currentTarget;

  const { value, selectionStart, selectionEnd } = textControl;
  const selection = value.substring(selectionStart, selectionEnd);

  currentSelection = selection;
  currentSelectionIdx = selectionStart;
  //console.log("Selection made of: " + currentSelection);
  
  document.getElementById("selectedAngles").style.display = "none";
  document.getElementById("selectedOmegaAngle").style.display = "none";
  document.getElementById("phiButton").removeAttribute("disabled");
  document.getElementById("psiButton").removeAttribute("disabled");
  document.getElementById("omegaButton").removeAttribute("disabled");
  
  if (currentSelection.length == 1) {
	document.getElementById("selectedAngles").style.display = "block";
	document.getElementById("selectedPhiSlider").value = currentAngles[selectionStart][0];
	document.getElementById("selectedPsiSlider").value = currentAngles[selectionStart][1];
	selectedPhiVal.innerHTML = currentAngles[selectionStart][0];
	selectedPsiVal.innerHTML = currentAngles[selectionStart][1];
  } else if (currentSelection.length == 2) {
	document.getElementById("selectedOmegaAngle").style.display = "block";
	document.getElementById("selectedOmegaSlider").value = currentAngles[selectionStart][2];
	selectedOmegaVal.innerHTML = currentAngles[selectionStart][2];
  }
  
  var currentSel = "{(resno>=" + String(selectionStart + 1) + " and resno<=" + String(selectionEnd) + ") and backbone}";
  //Jmol.script(jmol_intro, "dots OFF;set dotsSelectedOnly TRUE;select " + currentSelection + ";set dotDensity 4;color dots [158,36,123];dots 1.0 ON;"); // Trnaslucent doesn't seem to work for dots
  Jmol.script(jmol_intro, "halos OFF;select " + currentSel + ";color halos [158,36,123];halos 1.0;halos ON;");
  
  updateRamachandran();
}

function mainTextControl() {
  const textControl = document.getElementById("sequence");

  // enable text related, custom 'deselect' event handling.
  initializeHandleDeselectText(textControl);

  // native 'select' event handling.
  textControl.addEventListener('select', logTextSelection);

  // custom 'deselect' event handling.
  textControl.addEventListener('deselect', logTextDeselection);
}