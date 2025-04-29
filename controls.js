function setView(pdbID, viewID) {
	//console.log("Setting view for PDB ID " + pdbID + ", view ID " + viewID);
	
	const residues = getValueByKey(moleculeProps, pdbID)["residues"];
	const chains = getValueByKey(moleculeProps, pdbID)["chains"];
	
	const chain1 = chains[0][0];
	const chain2 = chains[0][1];
	
	const firstRes = residues[0][0];
	const lastRes = residues[0][1];
	
	var jmol_current = eval("jmol_" + getValueByKey(moleculeProps, pdbID)["type"]);
	
	// Commands that are just executed initially
	if (viewID == '0') {
		if (pdbID == "6EC0") {
			Jmol.script(jmol_current, "" + calcHBonds() + "hbonds off;");
		} else if (getValueByKey(moleculeProps, pdbID)["type"].includes("distorted")) {
			spinAroundAxis(jmol_current, firstRes, lastRes, chain1, chain2);
			onlySelectionOpaque(jmol_current, residues, chains);
		} else if (pdbID == "1GPB") {
			Jmol.script(jmol_current, "" + calcHBonds() + "hbonds off;");
			onlySelectionOpaque(jmol_current, residues, chains);
		} else if (pdbID == "2QD1") {
			Jmol.script(jmol_current, "" + calcHBonds() + "hbonds off;");
			onlySelectionOpaque(jmol_current, residues, chains);
		} else if (pdbID == "2BEG") {
			currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ") or (resno>=" + residues[2][0] + " and resno<=" + residues[2][1] + " and chain=" + chains[2][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
			onlySelectionOpaque(jmol_current, residues, chains);
			let commands = '';
			let startRes, endRes, startChain, endChain, bondStart, bondEnd, color;
			for (pair = 0; pair < 2; pair++) {
				let hbonds = [];
				for (i = 1; i < 9; i++) {
					if (i % 2) {
						startRes = String(residues[1 + pair][0] + i);
						endRes = String(residues[0 + pair][0] + i - 1);
						startChain = chains[1 + pair][0];
						endChain = chains[0 + pair][0];
					} else {
						startRes = String(residues[0 + pair][0] + i);
						endRes = String(residues[1 + pair][0] + i - 1);
						startChain = chains[0 + pair][0];
						endChain = chains[1 + pair][0];
					}
					// Start of hydrogen bond
					bondStart = '{' + startRes + ':' + startChain + '.H/1}.xyz';
					// End of hydrogen bond
					bondEnd = '{' + endRes + ':' + endChain + '.O/1}.xyz';
					hbonds.push([bondStart, bondEnd]);
				}
				for (i = 0; i < hbonds.length - 1; i++) {
					color = '171, 181, 146';
					commands += 'xyzstart = (' + hbonds[i][0] + ' + ' + hbonds[i][1] + ') / 2;';
					commands += 'xyzend = (' + hbonds[i+1][0] + ' + ' + hbonds[i+1][1] + ') / 2;';
					commands += 'draw line' + String(i + pair * 8) + ' ARROW width 0.25 color [' + color + '] @xyzstart @xyzend;';
				}
			}
			Jmol.script(jmol_current, commands);
		} else if (pdbID == "1OFS") {
			currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
			onlySelectionOpaque(jmol_current, residues, chains);
		} else if (pdbID == "2YXF") {
			currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
			onlySelectionOpaque(jmol_current, residues, chains);
			let commands = '';
			let startRes, endRes, startChain, endChain, start, end, color;
			let hbonds = [];
			for (i = 0; i < 6; i++) {
				if (i % 2) {
					startRes = String(residues[1][0] + 5 - i + 1);
					endRes = String(residues[0][0] + i - 1);
					startChain = chains[1][0];
					endChain = chains[0][0];
				} else {
					startRes = String(residues[0][0] + i);
					endRes = String(residues[1][0] + 5 - i);
					startChain = chains[0][0];
					endChain = chains[1][0];
				}
				// Start of hydrogen bond
				start = '{' + startRes + ':' + startChain + '.N}.xyz';
				// End of hydrogen bond
				end = '{' + endRes + ':' + endChain + '.O}.xyz';
				hbonds.push([start, end]);
			}
			for (i = 0; i < hbonds.length - 1; i++) {
				if (i % 2) {
					color = '113, 144, 112';
				} else {
					color = '171, 181, 146';
				}
				commands += 'xyzstart = (' + hbonds[i][0] + ' + ' + hbonds[i][1] + ') / 2;';
				commands += 'xyzend = (' + hbonds[i+1][0] + ' + ' + hbonds[i+1][1] + ') / 2;';
				commands += 'draw line' + i + ' ARROW width 0.25 color [' + color + '] @xyzstart @xyzend;';
			}
			Jmol.script(jmol_current, commands);
		} else if (pdbID == "1BA7") {
			currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
			onlySelectionOpaque(jmol_current, residues, chains);
			// Create axes illustrating twist sense
			let commands = '';
			// Start of strand
			commands += 'xyzstart = {' + residues[0][0] + ':' + chains[1][0] + '.CA}.xyz;';
			// End of strand
			commands += 'xyzend = {' + residues[0][1] + ':' + chains[1][1] + '.CA}.xyz;';
			commands += 'draw line1 ARROW width 0.25 color [171, 181, 146] @xyzstart @xyzend;';
			commands += 'draw arc1 ARROW ARC SCALE 4.0 DIAMETER 0.1 color [171, 181, 146] @xyzstart @xyzend {0, 0, 0} {90 270 0.5};';
			// Start of sheet
			commands += 'xyzstart = ({' + residues[0][0] + ':' + chains[0][0] + '.CA}.xyz + {' + residues[1][1] + ':' + chains[1][1] + '.CA}.xyz) / 2;';
			// End of sheet
			commands += 'xyzend = ({' + residues[1][0] + ':' + chains[1][0] + '.CA}.xyz + {' + residues[0][1] + ':' + chains[0][1] + '.CA}.xyz) / 2;';
			commands += 'draw line2 ARROW width 0.25 color [113, 144, 112] @xyzstart @xyzend;';
			commands += 'draw arc2 ARROW ARC SCALE 10.0 DIAMETER 0.1 color [113, 144, 112] @xyzstart @xyzend {0, 0, 0} {90 270 0.5};';
			// Start of sheet (orthogonal)
			commands += 'xyzstart = ({' + residues[1][0] + ':' + chains[1][0] + '.CA}.xyz + {' + residues[1][1] + ':' + chains[1][1] + '.CA}.xyz) / 2;';
			// End of sheet (orthogonal)
			commands += 'xyzend = ({' + residues[0][0] + ':' + chains[0][0] + '.CA}.xyz + {' + residues[0][1] + ':' + chains[0][1] + '.CA}.xyz) / 2;';
			commands += 'draw line3 ARROW width 0.25 color [149, 192, 61] @xyzstart @xyzend;';
			commands += 'draw arc3 ARROW ARC SCALE 10.0 DIAMETER 0.1 color [149, 192, 61] @xyzend @xyzstart {0, 0, 0} {0 270 0.5};';
			Jmol.script(jmol_current, commands);
		} else if (pdbID == "2TRX") {
			Jmol.script(jmol_current, "hide not :A;");
			onlySelectionOpaque(jmol_current, residues, chains);
		} else if (pdbID == "1LRI") {
			onlySelectionOpaque(jmol_current, residues, chains);
			// End
			currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";color cartoons [171, 181, 146];");
			// Omega loop
			currentSelection = "{(resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";color cartoons [158,36,123];");
			// Other random coil
			currentSelection = "{(resno>=" + residues[2][0] + " and resno<=" + residues[2][1] + " and chain=" + chains[1][0] + ")}";
			Jmol.script(jmol_current, "select " + currentSelection + ";color cartoons [113, 144, 112];");
		}
		// Label N- and C-Terminus
		if (["1QOY", "1TVF", "5MBN", "1RWZ", "1KSS", "1QAZ", "1MG6", "1CTQ"].includes(pdbID)) {
			//Jmol.script(jmol_current, "select " + currentSelection + ";color cartoon group;")
			currentSelection = "{atomName=CA and resno=" + firstRes + " and :" + chain1 + "}";
			Jmol.script(jmol_current, "select " + currentSelection + ";label \"<color blue>N</color>\";")
			currentSelection = "{atomName=CA and resno=" + lastRes + " and :" + chain2 + "}";
			Jmol.script(jmol_current, "select " + currentSelection + ";label \"<color red>C</color>\";")
		}
	}
	
	// Resetting the view
	if (["6EC0", "1GPB", "2QD1", "2BEG", "1OFS", "2YXF", "1BA7"].includes(pdbID) || getValueByKey(moleculeProps, pdbID)["type"].includes("distorted")) {
		if (viewID == '0' || viewID == '1') {
			if (pdbID == "6EC0") {
				half = Math.round((lastRes - firstRes) / 2);
				//onlySelectionOpaque(jmol_current, residues, chains);
				alignToAtomPair(jmol_current, firstRes + half - 5, lastRes - half + 5, chain1, chain2);
				Jmol.script(jmol_current, "rotate -z 90;");
			} else if (getValueByKey(moleculeProps, pdbID)["type"].includes("distorted")) {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
			} else if (pdbID == "1GPB") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate -z 90;");
			} else if (pdbID == "2QD1") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate -z 90;");
			} else if (pdbID == "2BEG") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate -x 115;");
				Jmol.script(jmol_current, "rotate y 30;");
			} else if (pdbID == "1OFS") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate z 10;");
				Jmol.script(jmol_current, "rotate y 90;");
				currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
				Jmol.script(jmol_current, "zoom (" + currentSelection + ") 600;");
			} else if (pdbID == "2YXF") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate y 90;");
				Jmol.script(jmol_current, "rotate z -45;");
				currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
				Jmol.script(jmol_current, "zoom (" + currentSelection + ") 400;");
			} else if (pdbID == "1BA7") {
				alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
				Jmol.script(jmol_current, "rotate y 90;");
				Jmol.script(jmol_current, "rotate z 45;");
				currentSelection = "{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ") or (resno>=" + residues[1][0] + " and resno<=" + residues[1][1] + " and chain=" + chains[1][0] + ")}";
				Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 0;");
			}
		}
	} else if (getValueByKey(moleculeProps, pdbID)["type"].includes("bulge")) {
		alignToAtomPair(jmol_current, residues[currentIDs["bulge"] * 2][0], residues[currentIDs["bulge"] * 2][1], chains[currentIDs["bulge"] * 2][0], chains[currentIDs["bulge"] * 2][1]);
		Jmol.script(jmol_current, "select (all);hbonds DELETE;");
		if (pdbID == "1DPX") {
			currentSelection = (
			"{(resno>=" + String(residues[currentIDs["bulge"] * 2][0] - 1) + " and resno<=" + String(residues[currentIDs["bulge"] * 2][1] + 1) + " and chain=" + chains[currentIDs["bulge"] * 2][0] + ") or " + 
			"(resno>=" + String(residues[currentIDs["bulge"] * 2 + 1][0] - 1) + " and resno<=" + String(residues[currentIDs["bulge"] * 2 + 1][1] + 1) + " and chain=" + chains[currentIDs["bulge"] * 2 + 1][0] + ")}"
			);
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
		} else if (pdbID == "6LUX") {
			currentSelection = (
			"{(resno=" + String(residues[currentIDs["bulge"] * 2][0]) + " and chain=" + chains[currentIDs["bulge"] * 2][0] + ") or " + 
			"(resno=" + String(residues[currentIDs["bulge"] * 2 + 1][0] + 1) + " and chain=" + chains[currentIDs["bulge"] * 2 + 1][0] + ")}"
			);
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
			currentSelection = (
			"{(resno=" + String(residues[currentIDs["bulge"] * 2][1] + 1) + " and atomname=H and chain=" + chains[currentIDs["bulge"] * 2][1] + ") or " + 
			"(resno=" + String(residues[currentIDs["bulge"] * 2 + 1][1] - 1) + " and atomname=O and chain=" + chains[currentIDs["bulge"] * 2 + 1][1] + ")}"
			);
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
		} else if (pdbID == "155C") {
			currentSelection = (
			"{(resno>=" + String(residues[currentIDs["bulge"] * 2][0]) + " and resno<=" + String(residues[currentIDs["bulge"] * 2][1]) + " and chain=" + chains[currentIDs["bulge"] * 2][0] + ") or " + 
			"(resno>=" + String(residues[currentIDs["bulge"] * 2 + 1][0] - 1) + " and resno<=" + String(residues[currentIDs["bulge"] * 2 + 1][1]) + " and chain=" + chains[currentIDs["bulge"] * 2 + 1][0] + ")}"
			);
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
		} else {
			currentSelection = (
			"{(resno>=" + residues[currentIDs["bulge"] * 2][0] + " and resno<=" + residues[currentIDs["bulge"] * 2][1] + " and chain=" + chains[currentIDs["bulge"] * 2][0] + ") or " + 
			"(resno>=" + residues[currentIDs["bulge"] * 2 + 1][0] + " and resno<=" + residues[currentIDs["bulge"] * 2 + 1][1] + " and chain=" + chains[currentIDs["bulge"] * 2 + 1][0] + ")}"
			);
			Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
		}
		
		if (["5CPA"].includes(pdbID)) {
			Jmol.script(jmol_current, "set hbondsBackbone TRUE;");
		} else {
			Jmol.script(jmol_current, "set hbondsBackbone FALSE");
		}
		onlySelectionOpaque(jmol_current, residues.slice(currentIDs["bulge"] * 2, currentIDs["bulge"] * 2 + 2), chains.slice(currentIDs["bulge"] * 2, currentIDs["bulge"] * 2 + 2));
		
		switch(viewID) {
			case '0':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			Jmol.script(jmol_current, "rotate x 180;");
			break;
			case '1':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			Jmol.script(jmol_current, "rotate y -165;");
			Jmol.script(jmol_current, "rotate z 180;");
			break;
			case '2':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			Jmol.script(jmol_current, "rotate x 180;");
			break;
			case '3':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			Jmol.script(jmol_current, "rotate y 135;");
			Jmol.script(jmol_current, "rotate x 180;");
			Jmol.script(jmol_current, "rotate y 180;");
			break;
			case '4':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			break;
			case '5':
			Jmol.script(jmol_current, "zoomto 0 (" + currentSelection + ") 500;");
			Jmol.script(jmol_current, "rotate x 135;");
			break;
			default:
			console.log("Undefined view requested!");
		}
	} else if (getValueByKey(moleculeProps, pdbID)["type"].endsWith("turn")) {
		var currentKey = getValueByKey(moleculeProps, pdbID)["type"];
		
		var numberResidues = getResNumForTurn(currentKey);
		
		alignToAtomPair(jmol_current, residues[currentIDs[currentKey]][0], residues[currentIDs[currentKey]][1], chains[currentIDs[currentKey]][0], chains[currentIDs[currentKey]][1]);
		
		var currentSelection = "(resno>=" + residues[currentIDs[currentKey]][0] + " and resno<=" + residues[currentIDs[currentKey]][1] + " and chain=" + chains[currentIDs[currentKey]][0] + ")";
		var displayCommand = "display mainchain and not _H";
		// For delta turns only
		if (numberResidues == 2) {
			// Show capping atoms to make sure all dihedral angles are displayed
			currentSelection += " or (" + String(residues[currentIDs[currentKey]][0] - 1) + ".C and chain=" + chains[currentIDs[currentKey]][0] + ") or (" + String(residues[currentIDs[currentKey]][1] + 1) + ".N and chain=" + chains[currentIDs[currentKey]][0] + ")";
			// Show sidechain(s), too
			displayCommand = "display not _H";
		}
		currentSelection = "{" + currentSelection + "}";
		Jmol.script(jmol_current, "select " + currentSelection + ";wireframe only;wireframe reset;spacefill reset;color atoms CPK;" + displayCommand + " and chain=" + chains[currentIDs[currentKey]][0] + ";");
		onlySelectionOpaque(jmol_current, residues.slice(currentIDs[currentKey], currentIDs[currentKey] + 2), chains.slice(currentIDs[currentKey], currentIDs[currentKey] + 2));
		
		var atom1, atom2, atom3, atom4, measureID, phi, psi;
		
		// Display distance between C-alpha atoms of residues i and i + n
		
		//console.log("Measuring Cα distance.");
		
		atom1 = "(resno=" + String(residues[currentIDs[currentKey]][0]) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=CA)";
		atom2 = "(resno=" + String(residues[currentIDs[currentKey]][1]) + " and chain=" + chains[currentIDs[currentKey]][1] + " and atomname=CA)";
		currentSelection = [atom1, atom2].join(" ");
		//Jmol.script(jmol_current, 'measure ' + currentSelection + ' "Cα-Cα = %0.1VALUE Å //A"');
		measureID = 1;		
		Jmol.script(jmol_current, 'measure id "m' + measureID + '" "C<sub>α</sub>-C<sub>α</sub>" ' + currentSelection + ' align center color [158,36,123];'); // XXX Changing alingment or color for multiple labels with MEASURE ID command apparently not working!
		
		// Display dihedral angles
		
		//console.log("Measuring dihedral angles.");
		
		var start, end, shift;
		
		if (numberResidues == 2) {
			start = 0;
			end = 1;
			shift = 2;
		} else {
			start = 1;
			end = numberResidues - 2;
			shift = 0;
		}

		for (let i = start; i <= end; i++) {
			let numLabel;
			if (i == 0) {
				numLabel = 'i';
			} else {
				numLabel = 'i+' + i;
			}
		
			atom1 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i - 1) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=C)";
			atom2 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=N)";
			atom3 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=CA)";
			atom4 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=C)";
			phi = [atom1, atom2, atom3, atom4].join(" ");
			//Jmol.script(jmol_current, 'measure ' + phi1 + ' "φ+1 = %VALUE%UNITS";');
			measureID = 2 * i + shift;
			Jmol.script(jmol_current, 'measure id "m' + measureID + '" "φ<sub>' + numLabel + '</sub>" ' + phi + ';');
			
			atom1 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=N)";
			atom2 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=CA)";
			atom3 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=C)";
			atom4 = "(resno=" + String(residues[currentIDs[currentKey]][0] + i + 1) + " and chain=" + chains[currentIDs[currentKey]][0] + " and atomname=N)";
			psi = [atom1, atom2, atom3, atom4].join(" ");
			//Jmol.script(jmol_current, 'measure ' + psi1 + ' "ψ+1 = %VALUE%UNITS"';);
			measureID = 2 * i + 1 + shift;
			Jmol.script(jmol_current, 'measure id "m' + measureID + '" "ψ<sub>' + numLabel + '</sub>" ' + psi + ';');
		}
		
		// Display hydrogen bond between residues i and i + 3
		
		//console.log("Finding H-bonds.");
		
		atom1 = "(resno=" + String(residues[currentIDs[currentKey]][0]) + " and chain=" + chains[currentIDs[currentKey]][0] + ")";
		atom2 = "(resno=" + String(residues[currentIDs[currentKey]][1]) + " and chain=" + chains[currentIDs[currentKey]][1] + ")";
		currentSelection = "{(" + atom1 + " or " + atom2 + ")}";
		
		Jmol.script(jmol_current, "select " + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;");
		
		// Set label format
		
		Jmol.script(jmol_current, "color measure [158,36,123];");
		Jmol.script(jmol_current, "set labelfront;font measure 12;");
		
		if (currentKey == "piturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {6.385 7.6475 5.2545}; rotate z -146.45; rotate y 76.59; rotate z -68.24; zoom 700;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {103.5772857142857 24.318571428571424 9.45985714285714}; rotate z 65.67; rotate y 166.09; rotate z -129.8; zoom 900;");
				break;
				case '2':
				Jmol.script(jmol_current, "reset;center {-4.62817 26.5055 28.6575}; rotate z 140.11; rotate y 83.79; rotate z -173.52; zoom 800;");
				break;
				case '3':
				Jmol.script(jmol_current, "reset;center {31.36483 33.155 5.5386}; rotate z -24.04; rotate y 81.25; rotate z -15.94; zoom 700;");
				break;
				case '4':
				Jmol.script(jmol_current, "reset;center {-24.7185 51.3927 53.6225}; rotate z -33.28; rotate y 118.37; rotate z 60.44; zoom 1500;");
				break;
				case '5':
				Jmol.script(jmol_current, "reset;center {-20.4223 -57.53483 -10.45016}; rotate z 165.54; rotate y 119.05; rotate z 3.67; zoom 1400;");
				break;
				case '6':
				Jmol.script(jmol_current, "reset;center {-9.253833333333333 49.016999999999996 17.145}; rotate z 59.56; rotate y 122.94; rotate z 12.38; zoom 900;");
				break;
			}
		}
		
		if (currentKey == "alphaturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {12.593 10.7318 36.32}; rotate z 32.51; rotate y 103.84; rotate z 66.14; zoom 600;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {45.6922 72.3014 -24.1112}; rotate z 179.27; rotate y 105.03; rotate z -91.92; zoom 1200;");
				break;
				case '2':
				Jmol.script(jmol_current, "reset;center {-34.769 10.8664 26.645}; rotate z 92.72; rotate y 73.2; rotate z 90.51; zoom 900;");
				break;
				case '5':
				Jmol.script(jmol_current, "reset;center {41.0618 30.4604 69.6826}; rotate z -50.03; rotate y 61.03; rotate z 142.82; zoom 1100;");
				break;
				case '6':
				Jmol.script(jmol_current, "reset;center {25.0126 32.3162 50.024}; rotate z -84.69; rotate y 140.96; rotate z 144.87; zoom 800;");
				break;
				case '7':
				Jmol.script(jmol_current, "reset;center {27.862 25.018 21.4472}; rotate z -85.48; rotate y 73.5; rotate z -81.68; zoom 700;");
				break;
				case '8':
				Jmol.script(jmol_current, "reset;center {17.6836 34.708 28.4142}; rotate z 65.73; rotate y 71.09; rotate z -126.63; zoom 600;");
				break;
			}
			
		} else if (currentKey == "betaturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {13.26325 12.15275 16.76875}; rotate z 143.16; rotate y 20.17; rotate z -97.88; zoom 1000;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {-43.718 -141.3565 -49.45675}; rotate z 142.9; rotate y 126.64; rotate z 120.44; zoom 1100;");
				break;
				case '2':
				Jmol.script(jmol_current, "reset;center {74.05425 -53.83325 -9.33475}; rotate z 11.69; rotate y 61.28; rotate z 32.13; zoom 1000;");
				break;
				case '3':
				Jmol.script(jmol_current, "reset;center {39.65375 21.29575 54.054}; rotate z 119.95; rotate y 148.51; rotate z -49.93; zoom 1000;");
				break;
				case '4':
				Jmol.script(jmol_current, "reset;center {32.25925 6.335 -1.13275}; rotate z -27.31; rotate y 78.02; rotate z 166.17; zoom 1000;");
				break;
				case '5':
				Jmol.script(jmol_current, "reset;center {13.094 26.77675 2.025}; rotate z -139.47; rotate y 20.9; rotate z 153.22; zoom 1100;");
				break;
				case '6':
				Jmol.script(jmol_current, "reset;center {8.521 37.84925 34.5245}; rotate z 136.02; rotate y 146.34; rotate z 92.83; zoom 800;");
				break;
				case '7':
				Jmol.script(jmol_current, "reset;center {-17.03575 -0.1045 44.58775}; rotate z 174.57; rotate y 64.01; rotate z 104.87; zoom 1000;");
				break;
				case '8':
				Jmol.script(jmol_current, "reset;center {10.498 28.23 -29.159}; rotate z -134.43; rotate y 53.61; rotate z 68.58; zoom 1200;");
				break;
				case '9':
				Jmol.script(jmol_current, "reset;center {32.53975 26.77175 0.6075}; rotate z -5.86; rotate y 109.74; rotate z 149.52; zoom 1000;");
				break;
				case '10':
				Jmol.script(jmol_current, "reset;center {26.1225 7.7775 81.5245}; rotate z -133.1; rotate y 101.81; rotate z 8.41; zoom 1000;");
				break;
				case '11':
				Jmol.script(jmol_current, "reset;center {83.75325 14.383 46.641}; rotate z 87.84; rotate y 50.33; rotate z 106.9; zoom 1100;");
				break;
			}
		} else if (currentKey == "gammaturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {5.547 50.5957 8.691}; rotate z -64.49; rotate y 129.72; rotate z 51.37; zoom 1200;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {0.795 3.8287 25.9703}; rotate z -117.71; rotate y 100.88; rotate z -151.74; zoom 800;");
				break;
			}
		} else if (currentKey == "epsilonturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {12.677 71.4193 26.576}; rotate z -142.8; rotate y 117.67; rotate z 60.97; zoom 1100;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {2.1353 12.0917 6.939}; rotate z 119.9; rotate y 115.68; rotate z 154.0; zoom 900;");
				break;
				case '2':
				Jmol.script(jmol_current, "reset;center {27.5303 9.3737 20.9707}; rotate z -179.67; rotate y 119.67; rotate z 38.49; zoom 800;");
				break;
				case '3':
				Jmol.script(jmol_current, "reset;center {20.8653 43.9207 53.1697}; rotate z 173.36; rotate y 108.67; rotate z 57.94; zoom 1100;");
				break;
				case '4':
				Jmol.script(jmol_current, "reset;center {-27.8777 -1.777 6.178}; rotate z -152.86; rotate y 81.1; rotate z -46.3; zoom 1000;");
				break;
				case '5':
				Jmol.script(jmol_current, "reset;center {34.19925 -10.74225 -2.4925}; rotate z -169.82; rotate y 116.38; rotate z 8.78; zoom 800;");
				break;
			}
		} else if (currentKey == "deltaturn") {
			switch(viewID) {
				case '0':
				Jmol.script(jmol_current, "reset;center {-5.0795 39.598 8.7525}; rotate z -52.59; rotate y 144.07; rotate z 18.04; zoom 700; translate x -1.05; translate y 5.69;");
				break;
				case '1':
				Jmol.script(jmol_current, "reset;center {51.3855 75.3755 15.468}; rotate z -163.72; rotate y 54.84; rotate z 34.54; zoom 1700;");
				break;
			}
		}
	}  else if (pdbID == "idealalpha") {
		if (viewID == '6') { // Toggle backbone
			var commands = "";
			var terminitoggle = document.getElementById("helices_termini_toggle");
			var terminiState = terminitoggle.dataset.termini;
			var backbonetoggle = document.getElementById("helices_backbone_toggle");
			var backboneState = backbonetoggle.dataset.backbone;
			if (backboneState == "visible") {
				commands += '!exit;select backbone;wireframe off;trace on;trace 0.2;color atoms TRANSLUCENT 1 [158,36,123];';
				if (terminiState == "visible") {
					commands += 'select backbone;color trace [158,36,123];select (2-5);color trace [0, 90, 157];select (19-22);color trace [181, 23, 38];select (2);color trace blue;select (22);color trace red;';
				} else {
					commands += 'color trace [158,36,123];';
				}
				Jmol.script(jmol_current, commands);
				backbonetoggle.innerHTML = "Show backbone atoms";
				backbonetoggle.dataset.backbone = "hidden";
			} else {
				commands += '!exit;select backbone;trace off;wireframe on;wireframe reset;color atoms TRANSLUCENT 0.75 cpk;color (*.CB) TRANSLUCENT 0.75 [149, 192, 61];';
				if (terminiState == "visible") {
					commands += 'select backbone;select (2-5);color TRANSLUCENT 0.75 [0, 90, 157];select (19-22);color TRANSLUCENT 0.75 [181, 23, 38];select (2);color TRANSLUCENT 0.75 blue;select (22);color TRANSLUCENT 0.75 red;';
				}
				Jmol.script(jmol_current, commands);
				backbonetoggle.innerHTML = "Hide backbone atoms";
				backbonetoggle.dataset.backbone = "visible";
			}
		} else if (viewID == '1') { // Toggle sidechains
			var sidechainstoggle = document.getElementById("helices_sidechains_toggle");
			var sidechainsState = sidechainstoggle.dataset.sidechains;
			var backbonetoggle = document.getElementById("helices_backbone_toggle");
			var backboneState = backbonetoggle.dataset.backbone;
			
			if (sidechainsState == "visible") {
				Jmol.script(jmol_current, '!exit;select (sidechains or *.CA or *.HA);wireframe off;');
				sidechainstoggle.innerHTML = "Show sidechains";
				sidechainstoggle.dataset.sidechains = "hidden";
			} else {
				if (backboneState == "visible") {
					Jmol.script(jmol_current, '!exit;select (*.CB or *.CA);wireframe on;wireframe reset;color (*.CB) TRANSLUCENT 0.75 [149, 192, 61];');
				} else {
					Jmol.script(jmol_current, '!exit;select (*.CB or *.CA);wireframe on;wireframe reset;color (*.CB) [149, 192, 61];');
				}
				sidechainstoggle.innerHTML = "Hide sidechains";
				sidechainstoggle.dataset.sidechains = "visible";
			}
		} else if (viewID == '2') { // Toggle h-bonds // XXX Change so that h-bonds are between proper atoms when showing backbone!
			var toggle = document.getElementById("helices_hbonds_toggle");
			var hbondsState = toggle.dataset.hbonds;
			if (hbondsState == "visible") {
				Jmol.script(jmol_current, '!exit;select all;hbonds off;');
				toggle.innerHTML = "Show h-bonds";
				toggle.dataset.hbonds = "hidden";
			} else {
				Jmol.script(jmol_current, '!exit;select backbone;hbonds calculate;set hbondsBackbone TRUE;hbonds on;color hbonds [247,148,36];hbonds 0.1;');
				toggle.innerHTML = "Hide h-bonds";
				toggle.dataset.hbonds = "visible";
			}
		} else if (viewID == '3') { // Toggle axis
			var toggle = document.getElementById("helices_axis_toggle");
			var axisState = toggle.dataset.axis;
			if (axisState == "visible") {
				toggle.innerHTML = "Show helical axis";
				toggle.dataset.axis = "hidden";
			} else {
				toggle.innerHTML = "Hide helical axis";
				toggle.dataset.axis = "visible";
			}
		} else if (viewID == '4') { // Toggle termini and caps coloring
			var terminitoggle = document.getElementById("helices_termini_toggle");
			var terminiState = terminitoggle.dataset.termini;
			var backbonetoggle = document.getElementById("helices_backbone_toggle");
			var backboneState = backbonetoggle.dataset.backbone;
			
			if (terminiState == "visible") {
				if (backboneState == "visible") {
					Jmol.script(jmol_current, '!exit;select all;color atoms TRANSLUCENT 0.75 cpk;');
				} else {
					Jmol.script(jmol_current, '!exit;select all;color trace [158,36,123];');
				}
				terminitoggle.innerHTML = "Show termini &amp; caps";
				terminitoggle.dataset.termini = "hidden";
			} else {
				if (backboneState == "visible") {
					Jmol.script(jmol_current, '!exit;select backbone;color TRANSLUCENT 0.75 cpk;select (2-5);color TRANSLUCENT 0.75 [0, 90, 157];select (19-22);color TRANSLUCENT 0.75 [181, 23, 38];select (2);color TRANSLUCENT 0.75 blue;select (22);color TRANSLUCENT 0.75 red;');
					console.log("Shown termini for backbone");
				} else {
					Jmol.script(jmol_current, '!exit;select backbone;color trace [158,36,123];select (2-5);color trace [0, 90, 157];select (19-22);color trace [181, 23, 38];select (2);color trace blue;select (22);color trace red;');
					console.log("Shown termini for trace");
				}
				terminitoggle.innerHTML = "Hide termini &amp; caps";
				terminitoggle.dataset.termini = "visible";
			}
		} else if (viewID == '5') { // Toggle dipole moments
			var toggle = document.getElementById("helices_dipoles_toggle");
			var dipolesState = toggle.dataset.dipoles;
			if (dipolesState == "visible") {
				Jmol.script(jmol_current, '!exit;dipole bonds off;');
				toggle.innerHTML = "Show dipole moments";
				toggle.dataset.dipoles = "hidden";
			} else {
				Jmol.script(jmol_current, '!exit;dipole calculate bonds;dipole bonds on;dipole WIDTH 0.2 CROSS OFFSET 1.0 OFFSETSIDE 0.6;set dipoleScale 2;color dipole black;');
				toggle.innerHTML = "Hide dipole moments";
				toggle.dataset.dipoles = "visible";
			}
		}

		if (document.getElementById("helices_axis_toggle").dataset.axis == "hidden") {
			Jmol.script(jmol_helices, '!exit;delete $ line1;delete $ line2;');
		} else {
			Jmol.script(jmol_helices, 'script helicesScript.txt;');
		}
	} else if (pdbID == "2TRX") {
		var currentSelection = "(" + getSelectionString(residues, chains) + ")";
		if (viewID == '0') {
			alignToAtomPair(jmol_current, residues[2][0], residues[2][1], chain1, chain2);
			Jmol.script(jmol_current, "zoom 200;rotate x -30;translate y -12;rotate spin y 5;");
		} else if (viewID == '1') { // Toggle sidechains
			var toggle = document.getElementById("strands_sidechains_toggle");
			var sidechainsState = toggle.dataset.sidechains;
			if (sidechainsState == "visible") {
				Jmol.script(jmol_current, 'select all;wireframe off;');
				toggle.innerHTML = "Show sidechains";
				toggle.dataset.sidechains = "hidden";
			} else {
				Jmol.script(jmol_current, 'select {' + currentSelection + ' and (*.CB or *.CA)};color (*.CB) [149, 192, 61];wireframe on;wireframe reset;');
				toggle.innerHTML = "Hide sidechains";
				toggle.dataset.sidechains = "visible";
			}
		} else if (viewID == '2') { // Toggle h-bonds
			var toggle = document.getElementById("strands_hbonds_toggle");
			var hbondsState = toggle.dataset.hbonds;
			if (hbondsState == "visible") {
				Jmol.script(jmol_current, 'select all;hbonds off;');
				toggle.innerHTML = "Show h-bonds";
				toggle.dataset.hbonds = "hidden";
			} else {
				Jmol.script(jmol_current, 'select {' + currentSelection + ' and backbone};hbonds calculate;set hbondsBackbone TRUE;hbonds on;color hbonds [247,148,36];hbonds 0.1;');
				toggle.innerHTML = "Hide h-bonds";
				toggle.dataset.hbonds = "visible";
			}
		}
	}  else if (pdbID == "1ARB") {
		let commands = "";
		alignToAtomPair(jmol_current, firstRes, lastRes, chain1, chain2);
		currentSelection = ("{(resno>=" + residues[0][0] + " and resno<=" + residues[0][1] + " and chain=" + chains[0][0] + ")}");
		commands += "rotate x -90;select " + currentSelection + ";wireframe only;wireframe reset;spacefill reset;color atoms CPK;display mainchain and not _H and" + currentSelection + ";" + calcHBonds() + "hbonds on;color hbonds [247,148,36];hbonds 0.1;";
		
		var atom1, atom2, atom3, atom4, measureID;
		
		// Display distance between C-alpha atoms of specific residues

		commands += 'measure id "t1" "C<sub>α</sub>-C<sub>α</sub> = %0.1VALUE Å //A" (109.CA) (114.CA) align center color [158,36,123];';
		commands += 'measure id "t2" "C<sub>α</sub>-C<sub>α</sub> = %0.1VALUE Å //A" (109.CA) (112.CA) align center color [171, 181, 146];';
		commands += 'measure id "t3" "C<sub>α</sub>-C<sub>α</sub> = %0.1VALUE Å //A" (110.CA) (113.CA) align center color [149, 192, 61];';
		
		// Create labels for C-alpha atoms
		
		let fontSize = 20;
		commands += "select 109.CA;label \"<color black>i</color>\";font label " + fontSize + ";";
		commands += "select 110.CA;label \"<color black>i + 1</color>\";font label " + fontSize + ";";
		commands += "select 111.CA;label \"<color black>i + 2</color>\";font label " + fontSize + ";";
		commands += "select 112.CA;label \"<color black>i + 3</color>\";font label " + fontSize + ";";
		commands += "select 113.CA;label \"<color black>i + 4</color>\";font label " + fontSize + ";";
		commands += "select 114.CA;label \"<color black>i + 5</color>\";font label " + fontSize + ";";
		
		Jmol.script(jmol_current, commands);
	}
	
	if (["2QD1", "6EC0", "1GPB"].includes(pdbID)) {
	
		if (chain1 == chain2) {
			currentSelection = "{(resno>=" + firstRes + " and resno<=" + lastRes + " and chain=" + chain1 + ")}";
		} else {
			currentSelection = "{(resno>=" + firstRes + " and chain=" + chain1 + " and atomName=CA) or (resno<=" + lastRes + " and chain=" + chain2 + ")}";
		}
		
		var prefix;
		switch (pdbID) {
			case "2QD1":
			prefix = "pi";
			break;
			case "6EC0":
			prefix = "regular";
			break;
			case "1GPB":
			prefix = "threeten";
			break;
		}
		
		// Commands for further, specific view controls
		if (viewID == '2') {
			var toggle = document.getElementById(prefix + "_hbonds_toggle");
			var hbondsState = toggle.dataset.hbonds;

			if (hbondsState == "visible") {
				Jmol.script(jmol_current, "color [158,36,123];cartoon only;hbonds off;");
				toggle.innerHTML = "Show backbone with H-bonds";
				toggle.dataset.hbonds = "hidden";
			} else {
				Jmol.script(jmol_current, "select " + currentSelection + ";color CPK;wireframe only;wireframe reset;hide sidechain or not :" + chain1 + ";hbonds on;color hbonds [247,148,36];hbonds 0.1;");
				toggle.innerHTML = "Hide backbone with H-bonds";
				toggle.dataset.hbonds = "visible";
			}
		}
	
	}
}

function helicesHover() {
	console.log(this);
	
}