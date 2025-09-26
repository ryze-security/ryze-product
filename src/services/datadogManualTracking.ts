import { datadogRum } from "@datadog/browser-rum";

export const recordGetStartedClick = () => {
    datadogRum.addAction("Get Started button clicked", {
        action: "click",
        action_type: "get_started",
        page: window.location.pathname,
    });
};
