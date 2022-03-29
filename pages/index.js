import react, { useState, useEffect } from "react";
import { data } from "../data";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Candidate from "../components/Candidate";
import { styled } from "@mui/material/styles";
import Map from "../components/Map";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Viz() {
	const [result, setResult] = useState([]);
	const [secondResult, setSecondResult] = useState([]);
	const [compiled, setCompiled] = useState({});
	const [secondCompiled, setSecondCompiled] = useState({});
	const [weekRange, setWeekRange] = useState([10, 20]);
	const [weeks, setWeeks] = useState([]);
	const [tableBody, setTableBody] = useState([]);

	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	let increment = 0;

	const PrettoSlider = styled(Slider)({
		height: 8,

		"& 	.MuiSlider-track": {
			backgroundColor: "#FDE047",
		},
		"& .MuiSlider-thumb": {
			height: 18,
			width: 18,
			backgroundColor: "#FEF08A",
		},
		"& .MuiSlider-markLabel": {
			color: "#ffffff",
		},
	});

	const IOSSlider = styled(Slider)(({ theme }) => ({
		color: theme.palette.mode === "dark" ? "#3880ff" : "#3880ff",
		height: 2,
		padding: "15px 0",
		"& .MuiSlider-thumb": {
			height: 28,
			width: 28,
			backgroundColor: "#fff",
			"&:focus, &:hover, &.Mui-active": {
				boxShadow:
					"0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
				// Reset on touch devices, it doesn't add specificity
			
			},
		},
		"& .MuiSlider-valueLabel": {
			fontSize: 12,
			fontWeight: "normal",
			top: -6,
			backgroundColor: "unset",
			color: theme.palette.text.primary,
			"&:before": {
				display: "none",
			},
			"& *": {
				background: "transparent",
				color: theme.palette.mode === "dark" ? "#fff" : "#000",
			},
		},
		"& .MuiSlider-track": {
			border: "none",
		},
		"& .MuiSlider-rail": {
			opacity: 0.5,
			backgroundColor: "#bfbfbf",
		},
		"& .MuiSlider-mark": {
			backgroundColor: "#bfbfbf",
			height: 8,
			width: 1,
			"&.MuiSlider-markActive": {
				opacity: 1,
				backgroundColor: "currentColor",
			},
		},
	}));

	useEffect(() => {
		let tempWeek = [];
		data[0].date_data.map((weekData) => {
			tempWeek.push({ value: increment, label: weekData.date.slice(5) });
			increment = increment + 10;
		});
		setWeeks(tempWeek);

		search({ idx: 0, fromDate: "2020-04-18", endDate: "2020-04-25" });
	}, []);

	useEffect(() => {
		console.log("::::::::::", weekRange);
		search({ idx: 0, fromDate: "2020-04-18", endDate: "2020-04-25" });
		let fromIdx = weekRange[0] / 10;
		let endIdx = weekRange[1] / 10;
		if (weeks[fromIdx] || weeks[endIdx]) {
			search({
				fromDate: `2020-${weeks[fromIdx].label}`,
				endDate: `2020-${weeks[endIdx].label}`,
			});
		}
	}, [weekRange]);

	useEffect(() => {
		let tempresult = {
			AL: 0,
			AK: 0,
			AZ: 0,
			AR: 0,
			CA: 0,
			CO: 0,
			CT: 0,
			DE: 0,
			FL: 0,
			GA: 0,
			HI: 0,
			ID: 0,
			IL: 0,
			IN: 0,
			IA: 0,
			KS: 0,
			KY: 0,
			LA: 0,
			ME: 0,
			MD: 0,
			MA: 0,
			MI: 0,
			MN: 0,
			MS: 0,
			MO: 0,
			MT: 0,
			NE: 0,
			NV: 0,
			NH: 0,
			NJ: 0,
			NM: 0,
			NY: 0,
			NC: 0,
			ND: 0,
			OH: 0,
			OK: 0,
			OR: 0,
			PA: 0,
			RI: 0,
			SC: 0,
			SD: 0,
			TN: 0,
			TX: 0,
			Unknown: 0,
			UT: 0,
			VT: 0,
			VA: 0,
			WA: 0,
			DC: 0,
			WV: 0,
			WI: 0,
			WY: 0,
		};

		for (let idx = 0; idx < secondResult.length; idx++) {
			let spendstates = secondResult[idx].spend_data;

			for (let jdx = 0; jdx < spendstates.length; jdx++) {
				let region = spendstates[jdx].region;
				let amt_spent = spendstates[jdx].amt_spent;

				tempresult[region] += tempresult[region] + amt_spent;
			}
		}
		setSecondCompiled(tempresult);
	}, [secondResult]);

	useEffect(() => {
		let tempresult = {
			AL: 0,
			AK: 0,
			AZ: 0,
			AR: 0,
			CA: 0,
			CO: 0,
			CT: 0,
			DE: 0,
			FL: 0,
			GA: 0,
			HI: 0,
			ID: 0,
			IL: 0,
			IN: 0,
			IA: 0,
			KS: 0,
			KY: 0,
			LA: 0,
			ME: 0,
			MD: 0,
			MA: 0,
			MI: 0,
			MN: 0,
			MS: 0,
			MO: 0,
			MT: 0,
			NE: 0,
			NV: 0,
			NH: 0,
			NJ: 0,
			NM: 0,
			NY: 0,
			NC: 0,
			ND: 0,
			OH: 0,
			OK: 0,
			OR: 0,
			PA: 0,
			RI: 0,
			SC: 0,
			SD: 0,
			TN: 0,
			TX: 0,
			Unknown: 0,
			UT: 0,
			VT: 0,
			VA: 0,
			WA: 0,
			DC: 0,
			WV: 0,
			WI: 0,
			WY: 0,
		};

		for (let idx = 0; idx < result.length; idx++) {
			let spendstates = result[idx].spend_data;

			for (let jdx = 0; jdx < spendstates.length; jdx++) {
				let region = spendstates[jdx].region;
				let amt_spent = spendstates[jdx].amt_spent;

				tempresult[region] += tempresult[region] + amt_spent;
			}
		}
		setCompiled(tempresult);
	}, [result]);

	const search = ({ fromDate, endDate }) => {
		// we need to update the result data for both biden and trump
		setResult(
			data[0].date_data.filter(
				(week) => week.date >= fromDate && week.date <= endDate
			)
		);

		setSecondResult(
			data[1].date_data.filter(
				(week) => week.date >= fromDate && week.date <= endDate
			)
		);
	};

	const handleSliderChange = (event, newValue) => {
		setWeekRange(newValue);
		formatData();
	};

	const formatData = () => {
		let body = [];

		for (const [state, cost] of Object.entries(compiled)) {
			body.push({
				state: state,
				biden: cost,
			});
		}

		for (let idx = 0; idx < body.length; idx++) {
			console.log(body[idx].state);

			body[idx].trump = secondCompiled[body[idx].state];
			body[idx].net = body[idx].biden - body[idx].trump;
		}
		console.log(body);
		setTableBody(body);
	};

	const [bidenSort, setBidenSort] = useState(false);
	const [trumpSort, setTrumpSort] = useState(false);

	const handleBidenSort = () => {
		if (bidenSort) {
			//ascending
			tableBody.sort(function (a, b) {
				return parseFloat(a.biden) - parseFloat(b.biden);
			});

			setTableBody(tableBody);
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(b.biden) - parseFloat(a.biden);
			});
		}

		setBidenSort(!bidenSort);
	};

	const handleTrumpSort = () => {
		if (trumpSort) {
			//ascending
			tableBody.sort(function (a, b) {
				return parseFloat(a.trump) - parseFloat(b.trump);
			});

			setTableBody(tableBody);
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(b.trump) - parseFloat(a.trump);
			});
		}

		setTrumpSort(!trumpSort);
	};

	return (
		<div>
			<Head>
				<title>Spending</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<section className="bg-slate-800 flex justify-center">
				<div className="w-10/12 mt-20">
					<div className="font-libre font-bold text-5xl mb-4 text-white">
						Visualizing Presidential Ad Spending
					</div>
					<div className="font-sans text-white text-md font-thin">
						In its tracking of campaign spending on Facebook, Wesleyan Media
						Project focuses on identifying the sources of money behind the ads.
						Facebook requires that advertisers post the “Paid for By”
						disclaimer, listing the organization that paid for the ad. Often,
						the same organization will engage dozens of Facebook pages to post
						the ads. Together with the Center for Responsible Politics, WMP
						matches the Facebook records against external data to identify the
						sponsors behind political ads. The numbers you are seeing in the map
						are an aggregation of the amounts posted by Facebook in the spending
						reports on the Facebook Ad Library webpage. We report the spending
						by week, with Sunday being the first day of a week.
					</div>
					<section className="flex justify-end mt-10 mb-20 text-white font-sans font-thin space-x-20">
						<a className="cursor-pointer underline hover:opacity-80">
							Wesleyan Media Project
						</a>

						<a
							className="cursor-pointer underline hover:opacity-80"
							href="https://github.com/mostvaluableshipfriendship"
						>
							Source Code
						</a>
					</section>
				</div>
			</section>

			<div className="bg-slate-600 text-white flex justify-center py-20">
				<section className="w-10/12">
					<Box sx={{ width: 1300 }}>
						<PrettoSlider
							value={weekRange}
							onChange={handleSliderChange}
							marks={weeks}
							className="my-10 text-white font-sans text-5xl"
							step={10}
							style={{
								color: "white",
								trackColor: "yellow",
								markLabel: { color: "white" },
							}}
							min={0}
							max={300}
						/>
					</Box>
					<section className=" flex flex-wrap justify-center lg:justify-between">
						{data.map(({ id, party, sponsor_name }) => {
							return (
								<div key={id} className="my-8">
									{id === "dt" ? (
										<Candidate id={id} data={secondCompiled} party={party} />
									) : (
										<Candidate id={id} data={compiled} party={party} />
									)}
								</div>
							);
						})}
					</section>

					<section>
						<div className="overflow-x-auto justify-center flex  py-3 rounded-xl">
							<table className="table table-compact w-full">
								<thead>
									<tr className="font-libre text-md bg-slate-800">
										<th className="py-2 ">State</th>
										<th
											className="cursor-pointer underline py-2 "
											onClick={handleTrumpSort}
										>
											Biden Spending ($)
										</th>
										<th
											className="cursor-pointer underline py-2 "
											onClick={handleBidenSort}
										>
											Trump Spending ($)
										</th>
										<th className="cursor-pointer py-2 ">Net</th>
									</tr>
								</thead>
								<tbody>
									{tableBody.map((row) => {
										return (
											<tr className="border-y text-lg bg-gray-100 text-slate-900 border-slate-700 font-sans hover:bg-slate-700 hover:text-white transition ease-in duration-50">
												<th className="font-thin p-1">{row.state}</th>
												<th className="font-thin p-1">
													{formatter.format(row.trump)}
												</th>
												<th className="font-thin p-1">
													{formatter.format(row.biden)}
												</th>
												{row.net < 0 ? (
													<th className="font-medium text-blue-500">
														+{formatter.format(row.net * -1)}
													</th>
												) : (
													<th className="font-medium text-red-600">
														+{formatter.format(row.net)}
													</th>
												)}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</section>
			</div>
			<Footer />
		</div>
	);
}
