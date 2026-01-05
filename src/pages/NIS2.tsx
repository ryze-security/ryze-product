import { useEffect, useState } from 'react';
import { FadeInSection } from '@/components/FadeInSection';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/home/Navbar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { ArrowLeftIcon, X } from 'lucide-react';


const CheckApplicability = ({ open, onOpenChange }) => {
    interface QuestionsDTO {
        questionId: number;
        question: string;
        options: {
            option: string;
            nextStep: number;
            applicable?: boolean;
        }[];
    }

    const questions: QuestionsDTO[] = [
        {
            questionId: 1,
            question: "Does your organization deliver services or products to countries within the European Union?",
            options: [
                {
                    option: "YES",
                    nextStep: 2,
                },
                {
                    option: "NO",
                    nextStep: 6,
                    applicable: false
                }
            ]
        },
        {
            questionId: 2,
            question: "What is the size of your organization?",
            options: [
                {
                    option: "< 9 employees and < EUR 2m revenue",
                    nextStep: 5
                },
                {
                    option: "< 49 employees and < EUR 10m revenue",
                    nextStep: 5
                },
                {
                    option: "50 to 250 employees and EUR 10m to 50m revenue",
                    nextStep: 3
                },
                {
                    option: "> 250 employees and > EUR 50m revenue",
                    nextStep: 3
                },
            ]
        },
        {
            questionId: 3,
            question: "In which sector(s) does your company operate?",
            options: [
                {
                    option: "Energy, Transport (Air, Rail, Water or Road), Banking, Financial markets incl. insurance provider, Healthcare, Drinking water, Waste water, Digital infrastructure provider, ICT service management (managed service providers incl. security service providers), Public administration, Space",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "No, we are not operating in these sectors.",
                    nextStep: 4
                }
            ]
        },
        {
            questionId: 4,
            question: "Ok, do any of these additional sectors cover your organization?",
            options: [
                {
                    option: "Postal and courier services, Waste management, Chemicals, Food",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "Manufacturing (medical devices, computers, electronics, electrical, machinery, motor vehicles or other transport equipment), Digital service providers (Online Market Places, Online Search Engines, and Social Networking Service Platforms), Research",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "No, these sectors don't apply to us either. I am not sure.",
                    nextStep: 5
                }
            ]
        },
        {
            questionId: 5,
            question: "Does your organization fall under any of the following categories?",
            options: [
                {
                    option: "Digital infrastructure provider (DNS service providers, TLD name registries, data centre service providers, cloud computing service providers, content delivery networks, trust service providers)",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "Public administration",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "Government-related",
                    nextStep: 6,
                    applicable: true
                },
                {
                    option: "No, none of these.",
                    nextStep: 6,
                    applicable: false
                }
            ]
        }
    ];

    // Single state to track navigation history -> enable us to bring user back to his prev. question
    const [navigationHistory, setNavigationHistory] = useState<number[]>([1]);
    const [isApplicable, setIsApplicable] = useState<boolean | null>(null);


    const currentStep = navigationHistory[navigationHistory.length - 1];
    const currentQuestion = questions.find(q => q.questionId === currentStep);

    const handleOptionSelect = (option: string, nextStep: number, applicable?: boolean) => {
        if (nextStep === 6) {
            setIsApplicable(applicable ?? false);
        }
        setNavigationHistory(prev => [...prev, nextStep]);
    };

    const handleBack = () => {
        if (navigationHistory.length > 1) {
            // Remove the current step, revealing the previous one
            setNavigationHistory(prev => prev.slice(0, -1));
            if (currentStep === 6) {
                setIsApplicable(null);
            }
        }
    };

    return (
        <Dialog open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    // Reset all states when closing
                    setNavigationHistory([1]);
                    setIsApplicable(null);
                }
                onOpenChange(isOpen);
            }}>



            <DialogContent removeXButton={true} className="h-screen max-w-none w-screen m-0 p-0 border-0 bg-black">
                <div className="pointer-events-none hidden sm:block absolute left-0 top-0 right-52 bottom-52 bg-[radial-gradient(circle_at_12%_22%,rgba(168,85,247,0.5),transparent_45%)] z-10 " />

                {/* LOGO */}
                <img
                    className="w-10 h-10 md:w-12 md:h-12 lg:size-16 cursor-pointer absolute z-50 top-[46px] left-[76px] "
                    src="/assets/Ryzr_White Logo_v2.png"
                    alt="Ryzr Logo"
                />



                <div className="p-2 w-full h-full flex flex-col">
                    <FadeInSection delay={0.25}>


                        <section className="relative w-full flex flex-col items-center pt-[15vh] pb-24 text-center px-4">
                            <h1 className="w-full text-center text-3xl md:text-[40px] lg:text-[64px] font-bold text-white bg-transparent px-6 py-4 rounded-lg tracking-wide">
                                NIS2 Applicability Check
                            </h1>

                            {/* Custom X button */}
                            <X
                                className='absolute right-[5%] md:right-[15%] top-28 text-violet-ryzr border-violet-ryzr cursor-pointer border rounded-full p-2 size-8 hover:bg-violet-ryzr/20 transition-colors duration-200'
                                onClick={() => {
                                    setNavigationHistory([1]);
                                    setIsApplicable(null);
                                    onOpenChange(false);
                                }}
                            />

                        </section>

                        <FadeInSection delay={0.5}>
                            <section className='flex gap-y-6 flex-col max-w-6xl mx-auto '>

                                {currentStep !== 6 && (
                                    <h2 className="text-2xl font-bold text-center mb-16">
                                        {currentQuestion?.question}
                                    </h2>
                                )}

                                <div className="space-y-2">
                                    {currentStep !== 6 &&
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full items-stretch">
                                            {currentQuestion?.options.map((opt, index) => {
                                                const letter = String.fromCharCode(65 + index); // A, B, C, D, etc.
                                                return (
                                                    <FadeInSection delay={index * 0.08} key={opt.option}>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-full flex items-start gap-4 justify-start text-left py-6 px-6 whitespace-normal group border border-violet-ryzr rounded-2xl"
                                                            onClick={() => handleOptionSelect(opt.option, opt.nextStep, opt.applicable)}
                                                        >
                                                            <Label className="bg-[#31153F] size-6 rounded-full text-white flex items-center justify-center self-start shrink-0 ">
                                                                {letter}
                                                            </Label>
                                                            <span className="flex-1 leading-relaxed font-bold">
                                                                {opt.option}
                                                            </span>
                                                        </Button>
                                                    </FadeInSection>
                                                );
                                            })}
                                        </div>
                                    }
                                </div>

                                {currentStep !== 1 && currentStep !== 6 &&
                                    <div className='flex w-full mt-6'>
                                        <Button
                                            onClick={handleBack}
                                            variant='outline'>
                                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                                            Previous
                                        </Button>
                                    </div>
                                }

                                {/* Final Step answer */}
                                {currentStep === 6 && (
                                    <div className="text-center py-12 px-4 max-w-4xl mx-auto">
                                        <div className="bg-gradient-to-br from-purple-900/30 to-black/30 p-8 rounded-2xl border border-violet-ryzr/30 backdrop-blur-sm">
                                            <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                                                {isApplicable
                                                    ? "Your organization is LIKELY subject to NIS2 requirements"
                                                    : "Your organization is likely NOT subject to NIS2 requirements"
                                                }
                                            </h3>
                                            <p className="text-violet-100/80 text-lg mb-8 leading-relaxed max-w-3xl mx-auto">
                                                {isApplicable
                                                    ? "Based on your responses, your organization appears to be in scope for NIS2 compliance requirements. We recommend a detailed assessment to ensure full compliance with all applicable regulations."
                                                    : "Based on your responses, your organization does not appear to fall under the scope of NIS2 Directive."
                                                }
                                            </p>
                                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                                                <Button
                                                    variant="outline"
                                                    className="px-8 py-6 text-base border-violet-ryzr text-violet-100 hover:bg-violet-900/30 hover:text-white transition-all duration-300"
                                                    onClick={() => {
                                                        setNavigationHistory([1]);
                                                        setIsApplicable(null);
                                                        onOpenChange(false);
                                                    }}
                                                >
                                                    Close
                                                </Button>
                                                {isApplicable && (
                                                    <Button
                                                        asChild
                                                        className="px-8 py-6 text-base bg-violet-light-ryzr hover:bg-violet-ryzr text-white hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
                                                    >
                                                        <Link to="/home">
                                                            Run a detailed AI assessment
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </FadeInSection>


                    </FadeInSection>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const NIS2 = () => {
    const items = [
        { label: "About", target: "features", disabled: false },
        { label: "Use cases", target: "product", disabled: false },
        { label: "Book a demo", target: "contact-us", disabled: false },
        { label: "NIS2", href: "/nis2", disabled: false },
    ]

    const FAQs = [
        {
            question: "In which EU country is NIS2 in force",
            answer: "NIS2 is now in force in multiple EU countries, including Belgium, Croatia, Greece, Hungary, Italy, Latvia, Lithuania, Slovakia, Slovenia, Finland and others. Other Member States including France, Germany, the Netherlands, and Spain are finalising national legislation, with enforcement expected in the year 2026."
        },
        {
            question: "Who must comply with NIS2?",
            answer: "Medium and large organizations operating in the EU including essential and important entities as well as certain non-EU providers delivering critical services in the EU."
        },
        {
            question: "What does NIS2 require organizations to implement?",
            answer: "NIS2 mandates cybersecurity risk management, incident response and reporting, business continuity, access control, supply-chain security, and management accountability."
        },
        {
            question: "What happens if an organization does not comply?",
            answer: "Non-compliance can lead to significant fines, regulatory enforcement actions, increased supervision, and potential personal liability for senior management."
        },
        {
            question: "How does our automated NIS2 assessment help?",
            answer: "Our platform performs an in-depth automated assessment against 190+ NIS2-aligned controls, covering key domains such as incident management, access control, supply-chain security, governance, and operational resilience."
        },
        {
            question: "What makes the assessment more effective than manual reviews?",
            answer: "It rapidly analyzes policies, procedures, and reports using AI, identifies gaps at a control level, and provides recommendations for compliance - saving time, reducing human error, and improving consistency."
        },
        {
            question: "What other compliance frameworks does your platform support?",
            answer: "In addition to NIS2, our platform enables automated compliance reviews against ISO 27001, NIST CSF, and GDPR, allowing organizations to assess, map, and manage multiple regulatory and security frameworks through a single, unified solution."
        }
    ]

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
    };

    return (
        <section className="flex w-full bg-black text-white flex-col ">
            <Navbar items={items} />
            <div className='font-roboto pt-32 pb-0 px-3 sm:px-6 md:px-4 lg:px-16 flex flex-col'>

                <div className="flex xl:flex-row flex-col items-center sms:flex-row w-full p-0 sm:p-6 pb-10 ">

                    <div className="pointer-events-none hidden sm:block absolute left-0 top-0 right-52 bottom-52 bg-[radial-gradient(circle_at_12%_22%,rgba(168,85,247,0.5),transparent_45%)]" />

                    <div className="flex flex-col gap-y-4 p-10 z-10 w-full">
                        <h1 className="text-8xl font-bold">NIS2</h1>
                        <h3 className='font-base tracking-wider text-2xl mb-4'>EU&apos;s Network and Information Systems (NIS) Directive</h3>

                        {/* lists input */}
                        {/* <div className="text-2xl space-y-3 mb-4">
                            <ul className="space-y-3 list-disc pl-5">
                                <li>Strengthens cybersecurity through mandatory risk management, incident reporting, and resilience measures.</li>
                                <li>Makes senior management directly accountable for cybersecurity oversight and decisions.</li>
                                <li>Now in force in multiple EU countries, including Belgium, Italy, Greece, Finland, and others.</li>
                                <li>Non-compliance can result in heavy fines, regulatory action, and personal sanctions for executives.</li>
                            </ul>
                        </div> */}
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className='w-fit font-bold text-xl rounded-full bg-[#B05BEF] hover:bg-[#B05BEF]/70 text-white px-6 mb-10'>
                            Check Applicability
                        </Button>
                        <CheckApplicability
                            open={isDialogOpen}
                            onOpenChange={handleOpenChange}
                        />

                        <div className='max-w-sm mb-4'>
                            <p className='text-4xl font-extrabold tracking-wide mb-2'>Review compliance with our AI-based assessment for <span className='text-violet-ryzr'>€0</span> *</p>
                            <p className='text-[11px]'>* Promotion valid until 31st March 2026</p>
                        </div>

                        <div className='flex space-x-4'>
                            <Button
                                onClick={() => navigate("/sign-up")}
                                className='w-fit font-bold text-xl rounded-full bg-[#B05BEF] hover:bg-[#B05BEF]/70 text-white px-6'>Detailed AI-based assessment</Button>

                            {/* todo: add this later */}
                            <Button className='hidden w-fit font-bold text-xl rounded-full px-6'>Basic self assessment</Button>
                        </div>
                    </div>


                    <div className='flex h-full w-full items-center p-10 xl:p-0'>
                        <img
                            className="shadow-lg p-1"
                            src='/assets/NIS2-productImage.png'
                            alt='NIS2 product image'
                        />
                    </div>

                    {/* <div className='hidden xl:flex h-full w-full items-center'>
                        <img
                            className="shadow-lg p-1"
                            src='/assets/NIS2-productImage.png'
                            alt='NIS2 product image'
                        />
                    </div> */}


                </div>

                <p className='mb-6 px-[64px] text-2xl'>Explore compliance with ISO 27001, NIST CSF, and GDPR at no cost. <Link to="/sign-up" className='text-[#B05BEF] hover:underline'>Sign up</Link> to get started.</p>


                <div className="bg-[#1A1A1A] flex flex-col sm:flex-row rounded-2xl w-full p-0 sm:p-6 pb-10 mt-10">
                    <div className="flex flex-col space-y-4 w-full">



                        <FadeInSection>
                            <section
                                id="faq"
                                className="relative z-10 w-full p-10"
                            >
                                <div className="w-full flex flex-col">
                                    <h2 className="text-4xl font-bold mb-6 mx-auto">Question?</h2>
                                    <div className="w-full">
                                        {FAQs.map((faq, index) => (
                                            <Accordion key={index} type="multiple">
                                                <AccordionItem value={`item-${index + 1}`}>
                                                    <AccordionTrigger className="text-left text-lg md:text-[22px] text-[#D7D7D7]">
                                                        {faq.question}
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-sm md:text-base lg:text-lg text-[#d7d7d7dd]">
                                                        {faq.answer}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </FadeInSection>

                    </div>
                </div>
            </div>

        </section>
    )
}


export default NIS2
