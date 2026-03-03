import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveVideoProgressShared({
    videoId,
    language,
    step,
    total_time,
    stage_name,
    displayStep,
    currentTimeInSeconds = 0,
    isFinished = 0,
    credentials = {},
    baseUrl,
}) {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        const deviceKey = await AsyncStorage.getItem('deviceKey');
        if (!userId || !token) return;

        let currentViewsLocal = 0;
        let previousWatchedSeconds = 0;
        let previousFinishCount = 0;
        try {
            const savedProgress = await AsyncStorage.getItem('userProgress');
            if (savedProgress) {
                let progressData = [];
                try { progressData = JSON.parse(savedProgress); } catch (e) { progressData = []; }
                const videoProgress = progressData.find(p => p.video_id === videoId && (p.Language || '') === (language || '') && (p.level_step || 0) === (step || 0));
                if (videoProgress) {
                    currentViewsLocal = videoProgress.total_views || 0;
                    previousWatchedSeconds = videoProgress.watched_seconds || 0;
                    previousFinishCount = Number(videoProgress.is_finished) || 0;
                }
            }
        } catch (e) { console.error('Failed to get local video progress:', e); }

        const totalDuration = total_time ? Math.round(Number(total_time)) : 0;
        let isNowConsideredFinished = false;
        if (isFinished === 1) isNowConsideredFinished = true;
        else if (totalDuration > 0) {
            const percent = (currentTimeInSeconds / totalDuration) * 100;
            isNowConsideredFinished = percent >= 80;
        }
        const newIsFinished = isNowConsideredFinished ? 1 : 0;

        const playbackInfo = credentials.playbackInfo || null;
        const otp = credentials.otp || null;

        // Only send is_finished=1 when this video wasn't already marked finished locally.
        // Backend appears to accumulate finish counts, so avoid sending repeated 1s.
        const shouldSendFinished = newIsFinished === 1 && previousFinishCount === 0 ? 1 : 0;

        // send total_views as +1 only for the first recorded local view; subsequent saves send the same value
        const totalViewsToSend = (currentViewsLocal || 0) === 0 ? 1 : currentViewsLocal;

        const payload = {
            User_id: parseInt(userId, 10),
            video_id: videoId,
            last_watched_timestamp_seconds: currentTimeInSeconds,
            Language: language || "",
            is_finished: shouldSendFinished,
            level_step: step || 0,
            total_time: totalDuration,
            total_views: totalViewsToSend,
            watched_seconds: Math.max(previousWatchedSeconds || 0, currentTimeInSeconds),
            otp: otp,
            playback: playbackInfo,
            stage_name: (stage_name ? stage_name : '') + " " + (typeof displayStep !== 'undefined' && displayStep !== null ? displayStep : step),
            DeviceKey: deviceKey,
        };

        try {
            const endpoint = `${baseUrl || ''}User/User_Video_Data`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            let responseData = null;
            try { responseData = await response.json(); } catch (e) { console.error('Failed to parse response JSON:', e); }

            if (response.ok && responseData?.code === 200) {
                try {
                    const savedProgress = await AsyncStorage.getItem('userProgress');
                    let progressData = [];
                    if (savedProgress) {
                        try { progressData = JSON.parse(savedProgress); } catch (e) { progressData = []; }
                    }
                    const videoIndex = progressData.findIndex(p => p.video_id === videoId && (p.Language || '') === (language || '') && (p.level_step || 0) === (step || 0));

                    if (videoIndex > -1) {
                        progressData[videoIndex].total_views = payload.total_views;
                        progressData[videoIndex].is_finished = payload.is_finished;
                        progressData[videoIndex].last_watched_timestamp_seconds = payload.last_watched_timestamp_seconds;
                        progressData[videoIndex].watched_seconds = payload.watched_seconds;
                    } else {
                        progressData.push({ video_id: videoId, total_views: payload.total_views, is_finished: payload.is_finished, level_step: payload.level_step, Language: payload.Language, watched_seconds: payload.watched_seconds, last_watched_timestamp_seconds: payload.last_watched_timestamp_seconds });
                    }
                    await AsyncStorage.setItem('userProgress', JSON.stringify(progressData));
                    return { success: true, is_finished: newIsFinished, responseData };
                } catch (e) {
                    console.error('Failed to update local userProgress cache:', e);
                }
            } else {
                const errorMessage = responseData?.message || `HTTP Error: ${response?.status}`;
                console.error('Failed to update video progress on server:', errorMessage);
                return { success: false, responseData };
            }
        } catch (e) {
            console.error('A network error occurred while updating video progress:', e);
            return { success: false, error: e };
        }
    } catch (e) {
        console.error('saveVideoProgressShared failed:', e);
    }
}

export function clearSavedProgressKeys() {
    // No-op retained for compatibility
}
