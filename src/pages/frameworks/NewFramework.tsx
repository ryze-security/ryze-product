import React, { useState } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, CheckSquare, Square } from 'lucide-react'

const NewFramework = () => {
    const navigate = useNavigate()
    const informationSecurityDomains = [
        "Information Security Domain",
        "Organization of Information Security",
        "Threat Intelligence",
        "Asset Management",
        "Access Control",
        "Supplier Relationships",
        "Information security in use of cloud",
        "Information Security Incident Management",
        "Information Security Aspects of Business Continuity Management",
        "Compliance",
        "Human Resource Security",
        "Physical and Environmental Security",
        "Operations Security",
        "Network Security",
        "Cryptography",
        "System Acquisition, Development and Maintenance"
    ]

    // Generate controls for each domain (1.1, 1.2, etc.)
    const generateControls = (domainIndex: number) => {
        return Array.from({ length: 10 }, (_, i) => ({
            id: `${domainIndex + 1}.${i + 1}`,
            name: `Control ${domainIndex + 1}.${i + 1}`,
            selected: false
        }))
    }

    // Initialize domains with controls
    const [domains, setDomains] = useState(
        informationSecurityDomains.map((domain, index) => ({
            name: domain,
            selected: false,
            controls: generateControls(index)
        }))
    )

    // Dialog state
    const [showDialog, setShowDialog] = useState(false)
    const [frameworkName, setFrameworkName] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    // Toggle domain selection
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

    // Toggle control selection
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

    // Select all domains and controls
    const selectAll = () => {
        setDomains(prev => prev.map(domain => ({
            ...domain,
            selected: true,
            controls: domain.controls.map(control => ({ ...control, selected: true }))
        })))
    }

    // Deselect all domains and controls
    const deselectAll = () => {
        setDomains(prev => prev.map(domain => ({
            ...domain,
            selected: false,
            controls: domain.controls.map(control => ({ ...control, selected: false }))
        })))
    }

    // Check if any domains are selected
    const hasSelections = domains.some(domain => domain.selected || domain.controls.some(control => control.selected))

    // Check if all are selected
    const allSelected = domains.every(domain => domain.selected)

    // Handle create framework
    const handleCreateFramework = () => {
        if (!hasSelections) return
        setShowDialog(true)
    }

    // Handle dialog submit
    const handleDialogSubmit = () => {
        if (!frameworkName.trim()) return

        setIsCreating(true)
        // TODO: Add actual framework creation logic here
        console.log('Creating framework:', frameworkName)
        console.log('Selected domains:', domains.filter(d => d.selected || d.controls.some(c => c.selected)))

        setTimeout(() => {
            setIsCreating(false)
            setShowDialog(false)
            setFrameworkName('')
            navigate('/new-evaluation')
        }, 1000)
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


            {/* Framework Selection Section */}
            <section className="px-3 sm:px-6 md:px-4 lg:px-16 py-8">
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
                                                            {control.id} - {control.name}
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
            </section>

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


        </div>
    )
}

export default NewFramework
