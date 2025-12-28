import React from 'react'
import { FadeInSection } from '@/components/FadeInSection'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/home/Navbar'

const NIS2 = () => {
    const items = [
        { label: "About", target: "features", disabled: false },
        { label: "Use cases", target: "product", disabled: false },
        { label: "Book a demo", target: "contact-us", disabled: false },
        { label: "NIS2", href: "/nis2", disabled: false },
    ];

    const cards = [
        "Check Applicability",
        "Do a self review",
        "Do a AI driven Gap analysis"
    ]


    return (
        <>
            <Navbar items={items} />
            <FadeInSection>
                <div className="h-fit w-full flex flex-col items-center justify-center bg-[linear-gradient(to_bottom,#000000,#000000,#0B0B0B80,#B05BEF,#B05BEF)] lg:bg-[linear-gradient(to_bottom,#000000,#0B0B0B80,#B05BEF,#B05BEF)] text-white">
                    {/* Video and Title */}
                    <section className="relative w-full flex flex-col items-center pt-32 text-center px-4">
                        <div className="relative z-10 w-[40vw] aspect-square lg:w-[18rem]">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls={false}
                                className="block w-full h-full bg-transparent opacity-50"
                            >
                                <source
                                    src="/assets\200w-ezgif.com-gif-to-mp4-converter.mp4"
                                    type="video/mp4"
                                />
                            </video>
                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <h1 className="text-[13vw] md:text-[20vw] lg:text-9xl font-bold text-white bg-transparent px-6 py-4 rounded-lg tracking-wide">
                                    NIS2
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* CTA Button and Tagline */}
                    <section className="w-full text-center px-4 mt-8">
                        <FadeInSection delay={0.2}>
                            <p className="text-[2.5vw] md:text-xl font- max-w-4xl mx-auto mb-4 md:mb-6 leading-relaxed tracking-wide opacity-80">
                                The EU's Network and Information Security Directive 2.0 (NIS2) will compel many organizations to strengthen their cyber security strategies. Adopting a unified networking and security platform can help your team reduce risks and comply with new requirements — without adding costs or complexity.
                            </p>
                        </FadeInSection>
                    </section>

                    {/* Product Image with Glow */}
                    {/* <section className="border border-white w-full flex justify-center mt-8 lg:mt-12 px-4">
                        <div className="relative w-[90vw] lg:w-[80vw] aspect-[12/7] rounded-3xl bg-gradient-to-b from-[#5F5F5F] to-transparent z-10">
                            <div className="absolute w-[150vw] h-[175vw] max-h-[800px] lg:max-h-[1000px] md:w-[140vw] lg:h-[80vw] -z-10 top-1.5 lg:top-1/2 left-1/2 -translate-x-1/2 lg:-translate-y-1/4 pointer-events-none bg-[radial-gradient(ellipse_at_center,#000000_60%,#B05BEF_100%)] rounded-full" />

                            <div className="absolute inset-0 bg-gradient-to-b rounded-3xl from-transparent to-black opacity-100 z-20" />
                        </div>
                    </section> */}

                    <section className="relative z-10 w-full mt-12 bg-white min-h-[50vh] flex flex-col lg:flex-row max-lg:bg-gradient-to-tl from-violet-light-ryzr to-white">
                        <div className="w-full lg:w-[45%]">
                            <div className="py-12 px-6 space-y-6 md:py-20 lg:px-20 text-black">
                                <h2 className="font-semibold text-3xl lg:text-4xl leading-none tracking-tight">
                                    <FadeInSection>
                                        Step 1:{" "}
                                        <span className="text-violet-light-ryzr">
                                            Check Applicability
                                        </span>
                                    </FadeInSection>
                                </h2>
                                <FadeInSection delay={0.4}>
                                    <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8">
                                        <div className="flex flex-col lg:flex-row items-center">
                                            <div className="w-64 lg:w-72 h-56 border border-gray-300 rounded-2xl flex flex-col items-center justify-between text-center p-6 hover:border-violet-light-ryzr transition-colors bg-white shadow-sm">
                                                <div>
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-3 text-center">Check Applicability</h3>
                                                    <p className="text-sm lg:text-base text-gray-600 text-center leading-relaxed">
                                                        Determine if your organization falls under NIS2 requirements and understand your compliance obligations.
                                                    </p>
                                                </div>
                                                <Button variant="outline" className="bg-white mt-4">
                                                    Start
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                        <div className="w-full lg:w-[2%] flex justify-center items-center">
                            <div className="hidden lg:flex h-[75%] w-0.5 bg-gray-300"></div>
                            <div className="flex lg:hidden h-0.5 w-[200px] bg-gray-300"></div>
                        </div>
                        
                        <div className="w-full lg:w-[60%]">
                            <div className="py-12 px-6 space-y-6 md:py-20 lg:px-14 text-black">
                                <h2 className="font-semibold text-3xl lg:text-4xl leading-none tracking-tight">
                                    <FadeInSection>
                                        Step 2:{" "}
                                        <span className="text-violet-light-ryzr">
                                            Choose Your Approach
                                        </span>
                                    </FadeInSection>
                                </h2>
                                <FadeInSection delay={0.4}>
                                    <div className="flex flex-col lg:flex-row items-center gap-6">
                                        <div className="flex flex-col lg:flex-row items-center">
                                            <div className="w-64 lg:w-72 h-56 border border-gray-300 rounded-2xl flex flex-col items-center justify-between text-center p-6 hover:border-violet-light-ryzr transition-colors bg-white shadow-sm">
                                                <div>
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-3 text-center">Do a self review</h3>
                                                    <p className="text-sm lg:text-base text-gray-600 text-center leading-relaxed">Manual assessment of your security posture against NIS2 requirements</p>
                                                </div>
                                                <Button variant="outline" className="bg-white mt-4">
                                                    Start
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex lg:flex-col items-center justify-center px-4 lg:px-0">
                                            <span className="text-gray-400 font-medium text-lg">OR</span>
                                        </div>

                                        <div className="flex flex-col lg:flex-row items-center">
                                            <div className="w-64 lg:w-72 h-56 border border-gray-300 rounded-2xl flex flex-col items-center justify-between text-center p-6 hover:border-violet-light-ryzr transition-colors bg-white shadow-sm relative">
                                                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    Recommended
                                                </div>
                                                <div>
                                                    <h3 className="text-lg lg:text-xl font-semibold mb-3 text-center">AI driven Gap analysis</h3>
                                                    <p className="text-sm lg:text-base text-gray-600 text-center leading-relaxed">AI-powered analysis to identify gaps and get actionable insights</p>
                                                </div>
                                                <Button variant="outline" className="bg-white mt-4">
                                                    Start
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>


                    <section className='min-h-[800px]'></section>

                </div>
            </FadeInSection>
        </>
    )
}

export default NIS2
