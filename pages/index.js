import react, { useState, useEffect, useRef } from "react";
import { data } from "../data";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Candidate from "../components/Candidate";
import Head from "next/head";
import Footer from "../components/Footer";

import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function Viz() {
	const [weekRange, setWeekRange] = useState([10, 20]);
	const [weeks, setWeeks] = useState([]);
	const [tableBody, setTableBody] = useState([]);
	const [startDate, setStartDate] = useState();

	const [startDateString, setStartDateString] = useState("April 18");
	const [endDateString, setEndDateString] = useState("April 25");

	const [endDate, setEndDate] = useState();
	const [mapData, setMapData] = useState([]);
	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	let increment = 0;

	const theme = createTheme({
		components: {
			// Name of the component
			MuiSlider: {
				styleOverrides: {
					// Name of the slot
					
						// Some CSS
						markLabel: {
							color: "white",
							marginTop: "8px",
							fontWeight: 400,
						},
						markActive: {
							color: "black",
						},
						thumb: {
							color: "#FEF08A",
							height: "24px",
							width: "24px",
						},
						track: {
							color: "#FEF08A",
						}
				},
			},
		},
	});

	useEffect(() => {
		console.log("LIFECYCLE START");
		let tempWeek = [];
		let justWeeks = [];
		data[0].date_data.map((weekData) => {
			justWeeks.push(weekData.date);
			tempWeek.push({ value: increment, label: weekData.date.slice(5) });
			increment = increment + 10;
		});
		setWeeks(tempWeek);

		search({ fromDate: "2020-04-18", endDate: "2020-04-25" });
		console.log("LIFECYCLE END");
	}, []);

	useEffect(() => {
		const numToMonth = {
			1: "January",
			2: "February",
			3: "March",
			4: "April",
			5: "May",
			6: "June",
			7: "July",
			8: "August",
			9: "September",
			10: "October",
			11: "November",
			12: "December",
		};

		console.log("WEEK RANGE INIT");
		console.log("week range", weekRange);
		let fromIdx = weekRange[0] / 10;
		let endIdx = weekRange[1] / 10;
		if (weeks[fromIdx] && weeks[endIdx]) {
			search({
				fromDate: `2020-${weeks[fromIdx].label}`,
				endDate: `2020-${weeks[endIdx].label}`,
			});
		} else {
			search({ fromDate: "2020-04-18", endDate: "2020-04-25" });
		}

		if (weeks[fromIdx]) {
			setStartDate(`2020-${weeks[fromIdx].label}`);
			let monthIdx = Number(weeks[fromIdx].label.slice(0, 2));
			setStartDateString(
				`${numToMonth[monthIdx]} ${weeks[fromIdx].label.slice(3, 5)}`
			);
		} else {
			setStartDate("April 18th");
		}

		if (weeks[endIdx]) {
			setEndDate(`2020-${weeks[endIdx].label}`);
			let monthIdx = Number(weeks[endIdx].label.slice(0, 2));
			setEndDateString(
				`${numToMonth[monthIdx]} ${weeks[endIdx].label.slice(3, 5)}`
			);
		} else {
			setEndDate("April 25th");
		}

		console.log("WEEK RANGE END");
	}, [weekRange]);

	async function search({ fromDate, endDate }) {
		console.log("SEARCH INIT");
		// we need to update the result data for both biden and trump
		let bidenResult = data[0].date_data.filter(
			(week) => week.date >= fromDate && week.date <= endDate
		);

		let trumpResult = data[1].date_data.filter(
			(week) => week.date >= fromDate && week.date <= endDate
		);

		console.log("biden", bidenResult);
		console.log("trump", trumpResult);

		var bidenMapData = {};
		var trumpMapData = {};

		//toMapData
		for (let idx = 0; idx < bidenResult.length; idx++) {
			let spendstate = bidenResult[idx].spend_data;
			for (let kdx = 0; kdx < spendstate.length; kdx++) {
				let state = spendstate[kdx].region;
				let amount = spendstate[kdx].amt_spent;

				if (Object.keys(bidenMapData).includes(state)) {
					bidenMapData[state] += amount;
				} else {
					bidenMapData[state] = amount;
				}
			}
		}

		for (let jdx = 0; jdx < trumpResult.length; jdx++) {
			let spendstate = trumpResult[jdx].spend_data;

			for (let odx = 0; odx < spendstate.length; odx++) {
				let state = spendstate[odx].region;
				let amount = spendstate[odx].amt_spent;

				if (Object.keys(trumpMapData).includes(state)) {
					trumpMapData[state] += amount;
				} else {
					trumpMapData[state] = amount;
				}
			}
		}
		console.log("banannas", bidenMapData, trumpMapData);
		setMapData([bidenMapData, trumpMapData]);

		var body = [];

		for (const [state, cost] of Object.entries(bidenMapData)) {
			body.push({
				state: state,
				biden: cost,
			});
		}

		for (let idx = 0; idx < body.length; idx++) {
			let trumpCost = trumpMapData[body[idx].state];
			body[idx].trump = trumpCost;

			body[idx].net = trumpCost - body[idx].biden;
		}
		console.log("MY BODY", body);

		setTableBody(body);

		console.log("SEARCH END");
	}

	const handleSliderChange = (event, newValue) => {
		setWeekRange(newValue);
		formatData();
	};

	const formatData = () => {};

	const [bidenSort, setBidenSort] = useState(false);
	const [trumpSort, setTrumpSort] = useState(false);
	const [netSort, setNetSort] = useState(false);

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

	const handleNetSort = () => {
		if (netSort) {
			tableBody.sort(function (a, b) {
				return parseFloat(Math.abs(a.net)) - parseFloat(Math.abs(b.net));
			});
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(Math.abs(b.net)) - parseFloat(Math.abs(a.net));
			});
		}

		setNetSort(!netSort);
	};

	return (
		<div>
			<Head>
				<title>Spending</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
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
						<a
							href="https://mediaproject.wesleyan.edu/"
							target="_blank"
							rel="noreferrer"
							className="cursor-pointer underline hover:opacity-80"
						>
							Wesleyan Media Project
						</a>

						<a
							className="cursor-pointer underline hover:opacity-80"
							target="_blank"
							rel="noreferrer"
							href="https://github.com/mostvaluableshipfriendship/facebookad	"
						>
							Source Code
						</a>
					</section>
				</div>
			</section>

			<div className="bg-slate-600 text-white flex justify-center py-20">
				<section className="w-10/12">
					<div className="text-3xl font-bold font-libre">
						From {startDateString} to {endDateString}, 2020
					</div>
					<div className="flex justify-center">
						<ThemeProvider theme={theme}>
							<Box sx={{ width: 1300 }}>
								<Slider
									value={weekRange}
									onChange={handleSliderChange}
									marks={weeks}
									className="my-10 text-white font-sans text-5xl"
									step={10}
									style={{
										color: "white",
										markLabel: {
											color: "white",
										},
									}}
									min={0}
									max={300}
								/>
							</Box>
						</ThemeProvider>
					</div>
					<section className="my-20 flex flex-wrap justify-center">
						<Candidate id="jb" data={mapData[0]} party="d" />
						<Candidate id="dt" data={mapData[1]} party="r" />
					</section>

					<section>
						<div className="overflow-x-auto justify-center flex  py-3 rounded-xl">
							<table className="table table-compact w-full">
								<thead>
									<tr className="font-libre text-md bg-slate-800">
										<th className="py-2 ">State</th>
										<th
											className="cursor-pointer  py-2  hover:opacity-80 transition ease-in duration-50 "
											onClick={handleBidenSort}
										>
											<div className="flex justify-center space-x-2 items-center">
												<div>Biden Spending</div>
												{bidenSort ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
														/>
													</svg>
												)}
											</div>
										</th>
										<th
											className="cursor-pointer  py-2 flex items-end justify-center space-x-2 hover:opacity-80 transition ease-in duration-50 "
											onClick={handleTrumpSort}
										>
											<div>Trump Spending</div>
											{trumpSort ? (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
													/>
												</svg>
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth="2"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
													/>
												</svg>
											)}
										</th>
										<th
											className="cursor-pointer py-2  hover:opacity-80 transition ease-in duration-50 "
											onClick={handleNetSort}
										>
											<div className="flex justify-center space-x-2">
												<div>Net</div>
												{netSort ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-6 w-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth="2"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
														/>
													</svg>
												)}
											</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{tableBody.map((row) => {
										return (
											<tr
												key={row.net}
												className="border-y text-lg bg-gray-100 text-slate-900 border-slate-700 font-sans hover:bg-slate-700 hover:text-white transition ease-in duration-50"
											>
												<th className="font-thin p-1">{row.state}</th>
												<th className="font-thin p-1">
													{formatter.format(row.biden)}
												</th>
												<th className="font-thin p-1">
													{formatter.format(row.trump)}
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
