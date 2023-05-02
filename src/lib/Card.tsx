import React from "react";

const Card = ({ title, content }) => (
	<div className="card">
		<div>
			<a className="play" href="javascript:void()">
				<span className="material-symbols-rounded icon play-icon">
					play_circle
				</span>
			</a>
		</div>
		<div className="content">
			<h3>{title}</h3>
			<p>{content}</p>
			<div className="interactions">
				<input
					className="comments"
					type="text"
					placeholder="Write a comment..."
				/>
				<span className="material-symbols-rounded icon">favorite</span>
				<span className="material-symbols-rounded icon">comment</span>
				<span className="material-symbols-rounded icon">share</span>
				<span className="material-symbols-rounded icon">more_vert</span>
			</div>
		</div>
	</div>
);

export default Card;
