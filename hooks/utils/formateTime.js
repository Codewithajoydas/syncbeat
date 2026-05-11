const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
};

export default formatTime;