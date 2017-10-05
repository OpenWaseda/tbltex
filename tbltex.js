"use strict";

const fs = require('fs');

function readFile(fname) {
	let data = [];
	let buf;
	try {
		buf = fs.readFileSync(fname || process.stdin.fd);
	} catch (e) {
		return null;
	}
	let lines = buf.toString().split("\n");
	let y = 0;
	for (let i = 0; i < lines.length; i++) {
		let j = 0, x = 0, line = lines[i];
		if (line[0] == '#') continue;
		for (;;) {
			for (; j < line.length; j++)
				if (!line[j].match(/,|\t| /)) break;
			if (j >= line.length) break;
			let s = "";
			do {
				s += line[j++];
			} while (j < line.length && !line[j].match(/,|\t| /));
			if (!data[y]) data[y] = [];
			data[y].push(s);
		}
		y++;
	}
	return data;
}

function parseValue(value, resolution, dotResolution) {
	let digits = [], sign = 1, exponent = 0, point = -1, begin = 0, end;
	if (resolution == 0 && dotResolution == 0) return value;
	for (let i = 0; i < value.length; i++) {
		let c = value[i];
		if (c.match(/ \t/)) continue;
		if (digits.length == 0 && sign == 1 && c == "-") sign = -1;
		else if ("0123456789".indexOf(c) > -1) {
			if (c == 0 && digits.length == 0) return value;
			else digits.push(c);
		} else if (c == ".") {
			if (point > -1) return value;
			else point = digits.length;
		} else if (c == "e" || c == "E") {
			exponent = Number(value.slice(i + 1));
			if (isNaN(exponent)) return value;
			break;
		} else return value;
	}
	if (point == -1) point = digits.length;
	if (exponent != 0) {
		point += exponent;
		while (point > 0) {
			digits.splice(0, 0, '0');
			point++;
		}
	}
	let res = "";
	if (resolution > 0) begin = point + dotResolution - resolution;
	if (begin < 0) begin = 0;
	end = digits.length;
	if (dotResolution != 0) end = point + dotResolution;
	else if (resolution != 0) end = resolution;
	if (sign < 0) res += "-";
	for (let i = begin; i < end; i++) {
		if (i == point) res += ".";
		if (i >= digits.length) res += "0";
		else res += digits[i];
	}
	return res;
}

let inputData = null;
let inputSort = 0;
let inputResolution = 0;
let inputDotResolution = 0;
let inputIndex = 0;

let optTransverse = false;
let optDoc = false;

let heads = [];
let sorts = [];
let cols = [];
let maxCols = 0;

for (let i = 2; i < process.argv.length; i++) {
	let val = process.argv[i];
	if (val == "--file" || val == "-f") {
		val = process.argv[++i];
		inputData = readFile(val);
	} else if (val == "--sort" || val == "-s") {
		val = process.argv[++i];
		if      (val[0] == 'u') inputSort =  1;
		else if (val[0] == 'U') inputSort =  2;
		else if (val[0] == 'd') inputSort = -1;
		else if (val[0] == 'D') inputSort = -2;
		else {
			console.error("invalid setting for sort");
			process.exit(1);
		}
	} else if (val == "--resolution" || val == "-r") {
		val = process.argv[++i];
		let d = val.split(".");
		inputResolution = d[0] ? parseInt(d[0], 10) : 0;
		inputDotResolution = d[1] ? parseInt(d[1], 10) : 0;
	} else if (val == "--document" || val == "-d") {
		optDoc = true;
	} else if (val == "--transverse" || val == "-t") {
		optTransverse = true;
	} else if (!isNaN(parseInt(val, 10))) {
		inputIndex = parseInt(val, 10);
	} else {
		let list = [], max = 0x7FFFFFFF;
		if (!inputData) {
			inputData = readFile(null);
		}
		for (let j = 0; j < inputData.length; j++) {
			if (!inputData[j][inputIndex]) {
				console.error("index error");
				process.exit(1);
			}
			let dat = inputData[j][inputIndex];
			list.push(parseValue(dat, inputResolution, inputDotResolution));
		}
		heads.push(val);
		cols.push(list);
		sorts.push(inputSort);
		inputSort = 0;
		inputIndex++;
		if (inputData[0] && inputIndex >= inputData[0].length) inputIndex = 0;
	}
}

let rows = [];
for (let i = 0; ; i++) {
	let row = [];
	for (let j = 0; j < cols.length; j++) {
		if (i >= cols[j].length) break;
		else row.push(cols[j][i]);
	}
	if (row.length == 0) break;
	while (row.length < cols.length) row.push("");
	rows.push(row);
}

let sortOrder = [];
for (let i = 0; i < sorts.length; i++) {
	if (sorts[i] == 1 || sorts[i] == -1) sortOrder.push(i);
}
for (let i = 0; i < sorts.length; i++) {
	if (sorts[i] == 2 || sorts[i] == -2) sortOrder.push(i);
}
for (let i = 0; i < sortOrder.length; i++) {
	rows.sort((a, b) => {
		let ind = sortOrder[i];
		let A = parseInt(a[ind], 10), B = parseInt(b[ind], 10), ret;
		if (isNaN(A) || isNaN(B)) {
			A = a[ind].toString(); B = b[ind].toStrin();
		}
		if (A > B) ret = 1;
		else if (A < B) ret = -1;
		else ret = 0;
		if (sorts[ind] < 0) ret = -ret;
		return ret;
	});
}

// TODO: transverse

if (optDoc) process.stdout.write("\\documentclass{jsarticle}\n\\begin{document}\n");
process.stdout.write("\\begin{tabular}{");
for (let i = 0; i < heads.length; i++) {
	if (i > 0) process.stdout.write("|");
	process.stdout.write("c");
}
process.stdout.write("} \\hline\n\t");
for (let i = 0; i < heads.length; i++) {
	if (i > 0) process.stdout.write(" & ");
	process.stdout.write(heads[i]);
}
process.stdout.write("\\\\ \\hline");
for (let i = 0; i < rows.length; i++) {
	process.stdout.write("\n\t");
	for (let j = 0; j < rows[i].length; j++) {
		if (j > 0) process.stdout.write(" & ");
		process.stdout.write(rows[i][j]);
	}
	process.stdout.write("\\\\");
}
process.stdout.write(" \\hline\n\\end{tabular}\n");
if (optDoc) process.stdout.write("\\end{document}\n");

process.exit(0);
