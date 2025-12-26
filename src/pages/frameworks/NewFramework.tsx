import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckSquare, Square, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import collectionService from '@/services/collectionServices'
import { customFrameworkResponse, createCustomFrameworkRequest, controlArray } from '@/models/collection/collectionDTOs'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { loadCollections } from '@/store/slices/collectionSlice'

const NewFramework = () => {
    const navigate = useNavigate()
    const { toast } = useToast()
    const userData = useAppSelector((state) => state.appUser);
    const dispatch = useAppDispatch();

    // ---------- STATES -----------
    const [frameworkData, setFrameworkData] = useState<customFrameworkResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showDialog, setShowDialog] = useState(false)
    const [frameworkName, setFrameworkName] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    // Initialize domains with controls from API data 
    // This is the main state for the UI
    const [domains, setDomains] = useState<Array<{
        name: string
        selected: boolean
        controls: Array<{
            id: string
            name: string
            selected: boolean
        }>
    }>>([])

    // Fetch framework
    useEffect(() => {
        const fetchFrameworkData = async () => {
            try {
                setIsLoading(true)
                const data = await collectionService.getCustomFrameworkDomains()
                setFrameworkData(data)

                // Transform API data to domain structure -> Easy to handle the UI
                const transformedDomains = Object.entries(data.summary).map(([categoryName, controls]) => ({
                    name: categoryName,
                    selected: false,
                    controls: (controls as controlArray[]).map(control => ({
                        id: control.control_display_index,
                        name: control.control_display_name,
                        selected: false
                    }))
                }))

                setDomains(transformedDomains)
            } catch (error) {
                console.error('Failed to fetch framework data:', error)
                toast({
                    title: "Error",
                    description: "Failed to load framework data. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchFrameworkData()
    }, [toast])

    // Function to transform domains state to API format
    const getSelectedControlsForAPI = () => {
        return domains.reduce((acc, domain) => {
            const selectedControlsInDomain = domain.controls.filter(control => control.selected)
            if (selectedControlsInDomain.length > 0) {
                acc[domain.name] = selectedControlsInDomain.map(control => ({
                    control_display_index: control.id,
                    control_display_name: control.name
                }))
            }
            return acc
        }, {} as { [categoryName: string]: controlArray[] })
    }

    // ---------- FUNCTIONS RELATED TO UI -----------
    const toggleDomain = (domainIndex: number) => {
        setDomains(prev => prev.map((domain, index) => {
            if (index === domainIndex) {
                const newSelected = !domain.selected
                return {
                    ...domain,
                    selected: newSelected,
                    controls: domain.controls.map(control => ({
                        ...control,
                        selected: newSelected
                    }))
                }
            }
            return domain
        }))
    }

    const toggleControl = (domainIndex: number, controlId: string) => {
        setDomains(prev => prev.map((domain, index) => {
            if (index === domainIndex) {
                const updatedControls = domain.controls.map(control =>
                    control.id === controlId ? { ...control, selected: !control.selected } : control
                )
                const allControlsSelected = updatedControls.every(control => control.selected)

                return {
                    ...domain,
                    selected: allControlsSelected,
                    controls: updatedControls
                }
            }
            return domain
        }))
    }

    const selectAll = () => {
        setDomains(prev => prev.map(domain => ({
            ...domain,
            selected: true,
            controls: domain.controls.map(control => ({ ...control, selected: true }))
        })))
    }

    const deselectAll = () => {
        setDomains(prev => prev.map(domain => ({
            ...domain,
            selected: false,
            controls: domain.controls.map(control => ({ ...control, selected: false }))
        })))
    }

    const hasSelections = domains.some(domain => domain.selected || domain.controls.some(control => control.selected))
    const allSelected = domains.every(domain => domain.selected)
    const handleCreateFramework = () => {
        if (!hasSelections) return
        setShowDialog(true)
    }


    // ------------ FUNCTION TO CREATE FRAMEWORK ------------
    const handleDialogSubmit = async () => {
        if (!frameworkName.trim()) return
        setIsCreating(true)

        try {
            const selectedControlsForAPI = getSelectedControlsForAPI();
            const requestData: createCustomFrameworkRequest = {
                category_control_selection: selectedControlsForAPI,
                collection_display_name: frameworkName.trim(),
                global_framework_version: frameworkData?.version || 1,
                overwrite: false,
                tenant_id: userData.tenant_id
            };

            const response = await collectionService.createCustomFramework(requestData);
            toast({
                title: "Framework created successfully",
                description: `Framework "${response.collection_display_name}" created successfully with ${response.stats.controls_created} controls and ${response.stats.domains_created} domains.`,
                variant: "default",
                className: "bg-green-ryzr",
            });

            // Before navigating to evaluation page, update the collection slice
            dispatch(loadCollections(userData.tenant_id));
            navigate('/new-evaluation');

        } catch (error) {
            console.error('Failed to create framework:', error);
            toast({
                title: "Error",
                description: "Failed to create framework. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
            setShowDialog(false);
            setFrameworkName('');
        }
    }



    return (
        <div className="flex flex-col min-h-screen font-roboto bg-black text-white p-6">
            <section className="flex w-full bg-black text-white pb-0 pt-16 lg:pt-10 px-3 sm:px-6 md:px-4 lg:px-16 ">
                <div className="max-w-7xl flex flex-col sm:flex-row justify-between rounded-2xl bg-gradient-to-b from-[#B05BEF] to-[black] w-full p-0 sm:p-6 pb-10 ">
                    <div className="flex flex-col space-y-4 p-6 ">
                        <h1 className="text-6xl font-bold">Create Your Own Custom Framework</h1>
                        <h3>Design and implement tailored evaluation frameworks that meet your specific compliance needs and business requirements</h3>
                    </div>

                </div>
            </section>

            <section className="px-3 sm:px-6 md:px-4 lg:px-16 py-8">
                {isLoading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>
                        {/* Framework Selection Section */}
                        <div className="max-w-7xl">
                            <Card className="bg-zinc-900">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-white text-2xl mb-2">Select Framework Domains</CardTitle>
                                            <p className="text-gray-light-ryzr">Choose domains and controls to include in your custom framework</p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <div className="text-sm text-gray-light-ryzr mr-2">
                                                {domains.filter(d => d.selected).length}/{domains.length} selected
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={allSelected ? deselectAll : selectAll}
                                                className={`border-gray-600 hover:bg-gray-800 flex items-center gap-2 transition-all ${allSelected
                                                    ? 'bg-violet-ryzr/20 border-violet-ryzr text-violet-ryzr hover:bg-violet-ryzr/30'
                                                    : 'text-white'
                                                    }`}
                                            >
                                                {allSelected ? (
                                                    <>
                                                        <CheckSquare className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Deselect All</span>
                                                        <span className="sm:hidden">All</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Square className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Select All</span>
                                                        <span className="sm:hidden">All</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Accordion type="multiple" className="space-y-2">
                                        {domains.map((domain, domainIndex) => (
                                            <AccordionItem
                                                key={domainIndex}
                                                value={`domain-${domainIndex}`}
                                                className="bg-zinc-900"
                                            >
                                                <AccordionTrigger className="hover:no-underline px-4 py-3">
                                                    <div className="flex items-center justify-between w-full mr-4">
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                id={`domain-${domainIndex}`}
                                                                checked={domain.selected}
                                                                onCheckedChange={() => toggleDomain(domainIndex)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <Label
                                                                htmlFor={`domain-${domainIndex}`}
                                                                className="text-white font-medium text-left cursor-pointer"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {domain.name}
                                                            </Label>
                                                        </div>
                                                        <span className="text-gray-light-ryzr text-sm">
                                                            {domain.controls.filter(c => c.selected).length}/{domain.controls.length} selected
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <div className="space-y-2 ml-8">
                                                        {domain.controls.map((control) => (
                                                            <div key={control.id} className="flex items-center gap-3 py-2">
                                                                <Checkbox
                                                                    id={`control-${control.id}`}
                                                                    checked={control.selected}
                                                                    onCheckedChange={() => toggleControl(domainIndex, control.id)}
                                                                />
                                                                <Label
                                                                    htmlFor={`control-${control.id}`}
                                                                    className="text-gray-light-ryzr cursor-pointer"
                                                                >
                                                                    {control.name}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>

                                    {/* <Separator className="bg-gray-700 my-6" /> */}

                                    <div className="flex justify-between items-center">
                                        <div className="text-gray-light-ryzr">
                                            {domains.filter(d => d.selected).length} domains selected
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={handleCreateFramework}
                                                disabled={!hasSelections}
                                                className={!hasSelections ? 'opacity-50 cursor-not-allowed' : ''}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Create Framework Dialog */}
                        <Dialog open={showDialog} onOpenChange={setShowDialog}>
                            <DialogContent className="bg-zinc-900 border-gray-700">
                                <DialogHeader>
                                    <DialogTitle className="text-white">Create Custom Framework</DialogTitle>
                                    <DialogDescription className="text-gray-light-ryzr">
                                        Give your custom framework a name to proceed with creation.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="framework-name" className="text-white">Framework Name</Label>
                                        <Input
                                            id="framework-name"
                                            value={frameworkName}
                                            onChange={(e) => setFrameworkName(e.target.value)}
                                            placeholder="e.g., My Security Framework"
                                            className="bg-neutral-800 border-gray-600 text-white"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-light-ryzr">
                                        {domains.filter(d => d.selected || d.controls.some(c => c.selected)).length} domains will be included
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDialogSubmit}
                                        disabled={!frameworkName.trim() || isCreating}
                                        variant='primary'
                                        className="disabled:opacity-50"
                                    >
                                        {isCreating ? 'Creating...' : 'Create Framework'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </section>
        </div>
    )
}

export default NewFramework
