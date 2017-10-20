# tbltex --- latex table generator

This program generates latex table from tsv file.

## installation
```
sudo npm install -g tbltex
```

## global options

- `--document` or `-d` ... create entire latex-formated file

## column options

repeat the following options to create multiple columns.

- `--file` or `-f` ... input file (tsv)
- `--sort` .. specify one of uUdD to do sorting (uppercase is stronger)
- `--resolution` ... specify resolution. also `X.Y` type string is allowed.
-  N(number) ... use the Nth column of the input file (default: 0, 1, 2, ...). The number is zero-oriented.
- other string (required) ... create new colum titled with the string

if no files are specified with the column, stdin will be used.

## sample

### input files

```sample_a.txt
# sample a
15	288.15	1533.8500 	3.0300	0.2960
25	298.15	1540.7500	3.5425	0.2844
35	308.15	1545.3500 	4.0098	0.2722
45	318.15	1553.3500 	4.6559	0.2630
55	328.15	1558.0500 	5.3175	0.2499
65	338.15	1562.6500 	6.1592	0.2390
```

``` sample_b.txt
# sample b
15	10.24	0.3662
25	12.46	0.3534
35	14.73	0.3393
45	17.70	0.3295
55	21.28	0.3140
65	25.77	0.3012
```

### most simple way

```bash
$ cat sample_a.txt| tbltex
\begin{tabular}{c|c|c|c|c} \hline
	sample & a & Column 2 & Column 3 & Column 4\\ \hline
	15 & 288.15 & 1533.8500 & 3.0300 & 0.2960\\
	25 & 298.15 & 1540.7500 & 3.5425 & 0.2844\\
	35 & 308.15 & 1545.3500 & 4.0098 & 0.2722\\
	45 & 318.15 & 1553.3500 & 4.6559 & 0.2630\\
	55 & 328.15 & 1558.0500 & 5.3175 & 0.2499\\
	65 & 338.15 & 1562.6500 & 6.1592 & 0.2390\\ \hline
\end{tabular}
```

### simple way

show column 0-2 with the specified headers.

```bash
$ cat sample_a.txt | tbltex "Temp [℃]" "Temp [℉]" "$\lambda$ [nm]"
\begin{tabular}{c|c|c} \hline
	Temp [℃] & Temp [℉] & $\lambda$ [nm]\\ \hline
	15 & 288.15 & 1533.8500\\
	25 & 298.15 & 1540.7500\\
	35 & 308.15 & 1545.3500\\
	45 & 318.15 & 1553.3500\\
	55 & 328.15 & 1558.0500\\
	65 & 338.15 & 1562.6500\\ \hline
\end{tabular}
```

### specify resolution

```bash
$ cat sample_a.txt | tbltex "Temp [℃]" "Temp [℉]" --resolution .1 "$\lambda$ [nm]"
\begin{tabular}{c|c|c} \hline
	Temp [℃] & Temp [℉] & $\lambda$ [nm]\\ \hline
	15 & 288.15 & 1533.8\\
	25 & 298.15 & 1540.7\\
	35 & 308.15 & 1545.3\\
	45 & 318.15 & 1553.3\\
	55 & 328.15 & 1558.0\\
	65 & 338.15 & 1562.6\\ \hline
\end{tabular}
```

### select column and sort

use column 1 and 2. column 0 is not used.

```bash
$ cat sample_a.txt | tbltex --sort down 1 "Temp [℉]" 2 "$\lambda$ [nm]"
\begin{tabular}{c|c} \hline
	Temp [℉] & $\lambda$ [nm]\\ \hline
	338.15 & 1562.6500\\
	328.15 & 1558.0500\\
	318.15 & 1553.3500\\
	308.15 & 1545.3500\\
	298.15 & 1540.7500\\
	288.15 & 1533.8500\\ \hline
\end{tabular}
```

### multiple data files

```bash
$ tbltex --file sample_a.txt 1 "Temp [℉]" 2 "$\lambda$ [nm]" --file sample_b.txt 2 "duration [s]"
\begin{tabular}{c|c|c} \hline
	Temp [℉] & $\lambda$ [nm] & duration [s]\\ \hline
	288.15 & 1533.8500 & 0.3662\\
	298.15 & 1540.7500 & 0.3534\\
	308.15 & 1545.3500 & 0.3393\\
	318.15 & 1553.3500 & 0.3295\\
	328.15 & 1558.0500 & 0.3140\\
	338.15 & 1562.6500 & 0.3012\\ \hline
\end{tabular}
```

## license
MIT

