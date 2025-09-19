import { datadogRum } from "@datadog/browser-rum";
import { reactPlugin } from "@datadog/browser-rum-react";

export function initDatadogRum() {
    datadogRum.init({
        applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
        site: import.meta.env.VITE_DATADOG_SITE,
        service: "ryzr",
        env: import.meta.env.MODE,
        version: "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 50,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "mask-user-input",
        plugins: [reactPlugin()],
    });

    datadogRum.startSessionReplayRecording();
}
