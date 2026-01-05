import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {

    const privacyPolicy = {
        title: "Privacy Policy",
        lastUpdated: "04-01-2026",

        sections: [
            {
                id: 1,
                heading: "Introduction",
                content: [
                    "This Privacy Policy explains how Regalion OÜ (“we”, “our”, or “us”) collects, uses, stores, and protects personal data when you visit or use ryzr.io (the “Website”) and related services (the “Services”). We are committed to protecting your privacy and handling personal data in a transparent and secure manner in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR). This policy is intended to help you understand what data we collect, why we collect it, how it is used, and what choices you have."
                ]
            },

            {
                id: 2,
                heading: "Company Information",
                content: [
                    "Regalion OÜ is a company registered in Estonia under the name Regalion OÜ, with its registered address at Harju maakond, Tallinn, Kesklinna linnaosa, Sakala tn 7-2, 10141, Estonia."
                ]
            },

            {
                id: 3,
                heading: "Personal Data We Collect",
                content: [
                    "We collect personal data that you voluntarily provide when you interact with the Website or use our Services. This may include:"
                ],
                list: [
                    "Name",
                    "Email address",
                    "Company details",
                    "Account information",
                    "Billing details",
                    "Information you submit in communications with us (e.g., support requests, inquiries, or feedback"
                ],
                additionalContent: [
                    "We also use cookies and similar technologies strictly necessary for the operation and security of the Website and Services. These cookies are essential to enable core functionality such as user authentication, session management, security controls, and basic platform operation. We do not use cookies for analytics, advertising, tracking, profiling, or marketing purposes, and we do not use cookies to monitor user behaviour beyond what is technically required to deliver the Services. As these cookies are necessary for the functioning of the Website, they cannot be disabled through cookie preference settings without impacting usability."
                ]
            },

            {
                id: 4,
                heading: "How We Use Personal Data",
                content: [
                    "We use the collected personal data strictly for legitimate business purposes. These purposes include providing, operating, and maintaining the Services; managing user accounts; responding to inquiries and support requests; improving product functionality and user experience; ensuring platform security; and complying with legal and regulatory obligations. We may also contact users to request feedback related to product performance, usability, and overall experience in order to improve our Services. Such communications are limited to product- and service-related matters."
                ]
            },

            {
                id: 5,
                heading: "Use of Data for Training",
                content: [
                    "User data is not used for training any artificial intelligence or machine learning models, whether internal or third-party. Any data processed through the Services remains isolated and is handled solely for the purpose of delivering the agreed functionality to the user."
                ]
            },

            {
                id: 6,
                heading: "Data Storage, Location, and Security",
                content: [
                    "All user data is securely stored and processed within Microsoft Azure data centres located in Europe. We rely on Microsoft Azure’s enterprise-grade security controls and apply appropriate technical and organisational safeguards to protect personal data against unauthorised access, loss, alteration, or disclosure. While we take reasonable measures to protect data, no system can be guaranteed to be completely secure.",
                    "We do not sell personal data. We may share personal data only with trusted service providers who process data on our behalf for infrastructure hosting and authentication services, and only to the extent necessary to provide the Services. Such service providers are contractually obligated to protect personal data and process it in compliance with applicable data protection laws."
                ]
            },

            {
                id: 7,
                heading: "User Authentication and Third-Party Processing",
                content: [
                    "We use Clerk, Inc. as a third-party authentication provider to handle user sign-in and account management functionality, including login via Google single sign-on. Under Clerk’s privacy practices, personal information such as your email address and unique identifier is processed to authenticate and manage your account. Clerk also uses strictly necessary cookies and related technologies to enable and secure authentication flows (e.g., session cookies required for login). Clerk acts on our behalf as a data processor/service provider for authentication data that you provide during signup or login, and this data is used solely to deliver and secure the authentication service on ryzr.io. We do not use any data from Clerk for profiling, analytics, advertising or training purposes, and we limit its use strictly to essential authentication operations. Please note that Clerk’s own privacy policy governs how they process data on their systems, and you can review it here: https://clerk.com/legal/privacy"
                ]
            },

            {
                id: 8,
                heading: "Data Retention",
                content: [
                    "Personal data is retained only for as long as necessary to fulfil the purposes for which it was collected, including the provision of the Services, compliance with legal obligations, resolution of disputes, and enforcement of our agreements. When personal data is no longer required, it is securely deleted or anonymised."
                ]
            },

            {
                id: 9,
                heading: "Data Subject Rights",
                content: [
                    "Depending on your location, you may have certain rights under data protection laws, including the right to access, correct, delete, or restrict the processing of your personal data, as well as the right to object to processing or withdraw consent where applicable. To exercise these rights, contact us at the email listed below. We may need to verify your identity before processing requests, and certain requests may be limited where we have legal obligations or legitimate reasons to retain data.",
                    "Our Services are intended for business users and are not directed at children. We do not knowingly collect personal data from individuals under the age of 13."
                ]
            },

            {
                id: 10,
                heading: "Changes to This Privacy Policy",
                content: [
                    "We may update this Privacy Policy from time to time to reflect changes in legal requirements, technology, or our business practices. Any updates will be posted on this page with a revised “Last updated” date. Continued use of the Website or Services after such updates constitutes acceptance of the revised Privacy Policy."
                ]
            },

            {
                id: 11,
                heading: "Contact Information",
                content: [
                    "If you have any questions, concerns, or requests regarding this Privacy Policy or the processing of your personal data, you may contact us at privacy@ryzr.io."
                ]
            }
        ]
    };

    const navItems = [
        { label: "About", target: "features", disabled: false },
        { label: "Use cases", target: "product", disabled: false },
        { label: "Book a demo", target: "contact-us", disabled: false },
        { label: "NIS2", href: "/nis2", disabled: false },
    ];

    const ProductLinks = [
        { name: "Features", target: "features" },
        { name: "Product", target: "product" },
        { name: "FAQ", target: "faq" },
    ];

    const LegalLinks = [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/#" },
    ];


    return (
        <div className="min-h-screen flex flex-col text-white relative overflow-hidden bg-[#050108] bg-[radial-gradient(circle_40vw_at_50%_0%,_#6a1bb9_0%,_#3b0f5f_25%,_rgba(22,5,31,0.3)_75%,_transparent_70%)]">

            <Navbar items={navItems} />

            <main className="flex-1">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        {privacyPolicy.title}
                    </h1>

                    <p className="text-center text-gray-400 mb-12">
                        Last updated: {privacyPolicy.lastUpdated}
                    </p>

                    <div className="space-y-12">
                        {privacyPolicy.sections.map((section) => (
                            <section key={section.id} className="space-y-4">
                                <h2 className="text-2xl font-bold">
                                    {section.id}. {section.heading}
                                </h2>

                                <div className="space-y-4 text-gray-300 leading-relaxed">
                                    {section.content?.map((text, i) => (
                                        <p key={i}>{text}</p>
                                    ))}

                                    {section.list && (
                                        <ul className="list-disc pl-6 space-y-2">
                                            {section.list.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.additionalContent?.map((text, i) => (
                                        <p key={i}>{text}</p>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            <Footer ProductLinks={ProductLinks} LegalLinks={LegalLinks} />
        </div>

    );
};

export default PrivacyPolicy;