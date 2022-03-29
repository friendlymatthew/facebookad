import USAMap from "react-usa-map";
import React, { useEffect, useState } from "react";

export default function Map(props) {
	const [scores, setScores] = useState({});

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

	useEffect(() => {
		let costs = Object.values(props.data);

		costs = costs.sort((a, b) => a - b);
		let score = {};

		let masterData = props.data;

		for (let idx = 0; idx < costs.length; idx++) {
			let key = getKeyByValue(props.data, costs[idx]);
			score[key] = {
				fill: dHue[Math.floor(idx / 5)],
				//clickHandler: (event) => handleState({masterData[key]})
			};
		}

		setScores(score);
	}, [props.data]);

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	const mapHandler = (event) => {
		alert(event.target.dataset.name);
	};

	return (
		<div className="bg-orange-300">
			<USAMap customize={scores} onClick={mapHandler} />
		</div>
	);
}
