import { datadogRum } from "@datadog/browser-rum";

// [HOMEPAGE, NAVBAR]: Track get started button click
export const recordGetStartedClick = () => {
    datadogRum.addAction("Get Started button clicked", {
        action: "click",
        action_type: "get_started",
        page: window.location.pathname,
    });
};

// [HOMEPAGE]: Track demo form view
export const recordDemoFormView = (element: HTMLElement | null) => {
    if (!element) return;

    const hasViewed = { current: false };

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting && !hasViewed.current) {
                hasViewed.current = true;

                // Fire Datadog action
                datadogRum.addAction("demo_form_view", {
                    action: "view",
                    action_type: "form_impression",
                    page: window.location.pathname,
                });

                // Stop observing after first view
                observer.unobserve(element);
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(element);
};

// [HOMEPAGE]: Track first interaction with the demo form
export const recordDemoFormInteraction = () => {
    let hasInteracted = false;

    return () => {
        if (!hasInteracted) {
            hasInteracted = true;
            datadogRum.addAction("demo_form_interaction_start", {
                action: "interaction",
                action_type: "form_start",
                page: window.location.pathname,
            });
        }
    };
};

// [HOMEPAGE]: Track form submission
export const recordDemoFormSubmission = () => {
    datadogRum.addAction("demo_form_submitted", {
        action: "submit",
        action_type: "form_submission",
        page: window.location.pathname,
    });
};


// [Question Form]: Track when a question answer is updated
export const recordQuestionUpdate = (questionId: string, controlId: string) => {
    datadogRum.addAction("question_answer_updated", {
        action: "update",
        action_type: "question_update",
        question_id: questionId,
        control_id: controlId,
        page: window.location.pathname,
    });
};