/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import pb from "./pocketbase";

interface CardProps {
	track: any;
	currentTrack: any;
	setCurrentTrack: (track: any) => void;
}

interface Comment {
	id: string;
	content: string;
	track: string;
	created: string; // Add the created property
	likes: number; // Add the likes property
}

const Card = ({ track, currentTrack, setCurrentTrack }: CardProps) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [likes, setLikes] = useState(track.likes);
	const [views, setViews] = useState(track.views);
	const [playing, setPlaying] = useState(false);
	const audioElement = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const fetchComments = async () => {
			const fetchedComments = await pb.collection("comments").getFullList({
				sort: "-created",
				filters: { track: track.id },
			});

			// Map the fetched comments to the Comment type
			const commentsList: Comment[] = fetchedComments.map((comment: any) => ({
				id: comment.id,
				content: comment.content,
				track: comment.track,
				created: comment.created,
				likes: comment.likes,
			}));

			setComments(commentsList);
		};
		fetchComments();
	}, [track.id]);

	useEffect(() => {
		if (audioElement.current) {
			playing ? audioElement.current.play() : audioElement.current.pause();
		}
	}, [playing]);

	const onTrackEnd = () => {
		setPlaying(false);
	};

	const playTrack = async (track: any) => {
		if (
			currentTrack &&
			currentTrack !== track &&
			currentTrack.audioElement.current
		) {
			currentTrack.audioElement.current.pause();
		}

		if (!audioElement.current) {
			const audio = await pb.collection("tracks").getOne(track.id);
			audioElement.current = new Audio(
				`${import.meta.env.VITE_PB_URL}/api/files/ui9tn88oitvp172/${track.id}/${
					audio.file
				}`
			);
			audioElement.current.addEventListener("play", () => setPlaying(true));
			audioElement.current.addEventListener("pause", () => setPlaying(false));
			audioElement.current.addEventListener("ended", onTrackEnd);
		}
		setPlaying((prevState) => !prevState);
		setCurrentTrack({ id: track.id, audioElement });
		setViews(views + 1);
	};

	async function stopTrack(track: any) {
		playing ? setPlaying(false) : setPlaying(true);
		const audio = await pb.collection("tracks").getOne(track.id);
		const audioElement = document.createElement("audio");
		audioElement.src = `${
			import.meta.env.VITE_PB_URL
		}/api/files/ui9tn88oitvp172/${track.id}/${audio.file}`;
		audioElement.pause();
	}

	const formatNumber = (num: number) => {
		if (num > 1000000) {
			return `${Math.floor(num / 1000000)}M`;
		} else if (num > 1000) {
			return `${Math.floor(num / 1000)}K`;
		} else {
			return num;
		}
	};

	const formatTime = (time: string) => {
		const date = new Date(time);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		if (years > 0) {
			return `${years} years ago`;
		}
		if (months > 0) {
			return `${months} months ago`;
		}
		if (days > 0) {
			return `${days} days ago`;
		}
		if (hours > 0) {
			return `${hours} hours ago`;
		}
		if (minutes > 0) {
			return `${minutes} minutes ago`;
		}
		if (seconds > 0) {
			return `${seconds} seconds ago`;
		}
		return "just now";
	};

	const likeTrack = async () => {
		setLikes(likes + 1);
	};

	const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newComment = e.currentTarget.comment.value;
		await pb
			.collection("comments")
			.create({ track: track.id, content: newComment });
		e.currentTarget.comment.value = "";
	};

	return (
		<div className="card">
			<div className="play-button">
				<a
					className="play"
					onClick={() => (playing ? stopTrack(track) : playTrack(track))}
				>
					{playing ? (
						<span className="material-symbols-outlined icon play-icon">
							pause_circle
						</span>
					) : (
						<span className="material-symbols-outlined icon play-icon">
							play_circle
						</span>
					)}
				</a>
			</div>
			<div className="content">
				<h2 className={`title ${playing ? "playing" : ""}`}>
					{track.author ? track.author : "anonymous"} - {track.title}
				</h2>
				<p className="desc">{track.description}</p>

				<form onSubmit={handleCommentSubmit} className="interactions">
					<div className="comment-section">
						<p>Comments</p>
						<hr className="track-divider" />
						<div className="comment-list">
							{comments.map((comment) => (
								<div className="comment">
									<div className="comment-inside">
										<p>{comment?.content}</p>
										<p> • {formatTime(comment.created)} </p>
									</div>

									<div className="like-container">
										<p>{comment?.likes == 0 ? "" : comment?.likes}</p>
										<span className="material-symbols-rounded icon like-thumb">
											thumb_up
										</span>
									</div>
								</div>
							))}
						</div>
						<input
							name="comment"
							className="comments"
							type="text"
							autoCorrect="off"
							placeholder="Write a comment..."
						/>
					</div>
					<div className="stats">
						<div className="views">
							<span className="material-symbols-rounded icon">visibility</span>
							<span>{formatNumber(views)}</span>
						</div>
						<div className="likes" onClick={likeTrack}>
							<span>{formatNumber(likes)}</span>
							<span
								className={`material-symbols-rounded icon ${
									likes > 0 ? "active" : ""
								}`}
							>
								favorite
							</span>
						</div>
						<span className="material-symbols-rounded icon">repeat</span>
						<span className="material-symbols-rounded icon">share</span>
						<span className="material-symbols-rounded icon">more_vert</span>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Card;
