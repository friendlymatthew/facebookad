import USAMap from "react-usa-map";
import React, { useEffect, useState } from "react";

export default function Candidate(props) {
	const [scores, setScores] = useState({});
	const [clicked, setClicked] = useState({});

	const [hue, setHue] = useState({});
	const [data, setData] = useState(props.data);

	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});
	useEffect(() => {
		const dHue = {
			0: "#EFF6FF",
			1: "#DBEAFE",
			2: "#BFDBFE",
			3: "#93C5FD",
			4: "#7DD3FC",
			5: "#60A5FA",
			6: "#3B82F6",
			7: "#2563EB",
			8: "#1D4ED8",
			9: "#1E40AF",
			10: "#1E3A8A",
		};

		const rHue = {
			0: "#FEF2F2",
			1: "#FEE2E2",
			2: "#FECACA",
			3: "#FCA5A5",
			4: "#F87171",
			5: "#EF4444",
			6: "#DC2626",
			7: "#C2410C",
			8: "#B91C1C",
			9: "#991B1B",
			10: "#7F1D1D",
		};

		if (props.data) {
			console.log("active");

			console.log("data", props.data);

			var dataValues = Object.values(props.data);
			dataValues.sort(function (a, b) {
				return a - b;
			});

			var score = {};

			for (let idx = 0; idx < dataValues.length; idx++) {
				score[idx] = dataValues[idx];
			}

			console.log("this is the score", score);

			var palette = {};

			for (const [idx, amount] of Object.entries(score)) {
				console.log(idx, amount);
				let key = getKeyByValue(props.data, amount);
				console.log(key);

				var hugh;
				if (props.id === "dt") {
					hugh = rHue;
				} else {
					hugh = dHue;
				}

				palette[key] = {
					fill: hugh[Math.floor(idx / 5)],
					clickHandler: (event) => {
						showData(
							event.target.dataset.name,
							props.data[event.target.dataset.name]
						);
					},
				};
			}

			console.log(palette);
			setScores(palette);
		}
	}, [props.data]);

	const showData = (state, count) => {
		setClicked({ state, count });
	};

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	const mapHandler = (event) => {
		let stateKey = event.target.dataset.name;
		console.log("state", stateKey);
		console.log(props.data[stateKey]);
	};

	return (
		<div className="">
			{props.id === "dt" ? (
				<div className="flex justify-end">
					<div>
						<div className="font-libre text-3xl  font-bold">
							Donald J. Trump
						</div>
						<div className="flex justify-start lg:justify-end text-md font-sans font-light italic opacity-80">
							Republican
						</div>
					</div>
				</div>
			) : (
				<div className="">
					<div className="font-libre text-3xl  font-bold">Joseph R. Biden</div>
					<div className="text-md font-sans font-light italic opacity-80">
						Democrat
					</div>
				</div>
			)}

			<USAMap
				customize={scores}
				width={600}
				height={400}
				onClick={mapHandler}
			/>

			<div className="font-sans font-thin">
				{clicked.state}, {formatter.format(clicked.count)}
			</div>
		</div>
	);
}
