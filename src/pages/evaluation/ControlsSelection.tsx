import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { PlusCircle, SearchIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import { useController, Control } from "react-hook-form";
import evaluationServices from "@/services/evaluationServices";
import { RoundSpinner } from "@/components/ui/spinner";
import { getControlsResponseDTO, Control as ControlItem } from "@/models/evaluation/EvaluationDTOs";
import {
    ColumnDef,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ControlsSelectionProps {
    formControl: any;
    name: string;
    selectedFramework: any[];
    isControlsLoading: boolean;
    setIsControlsLoading: (isLoading: boolean) => void;
    controlsFilter: string;
}

// const columns: ColumnDef<ControlItem>[] = [
//     {
//         id: "select",
//         header: ({ table }) => (
//             <Checkbox
//                 checked={
//                     table.getIsAllPageRowsSelected() ||
//                     (table.getIsSomePageRowsSelected())
//                 }
//                 onCheckedChange={(value) =>
//                     table.toggleAllPageRowsSelected(!!value)
//                 }
//                 aria-label="Select all"
//             />
//         ),
//         cell: ({ row }) => (
//             <Checkbox
//                 checked={row.getIsSelected()}
//                 onCheckedChange={(value) => row.toggleSelected(!!value)}
//                 aria-label="Select row"
//             />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//     },
//     {
//         accessorKey: "control_id",
//         header: "Control ID",
//     },
//     {
//         accessorKey: "control_display_name",
//         header: "Control Title",
//     },
// ]



const ControlsSelection = ({ formControl, name, selectedFramework, isControlsLoading, setIsControlsLoading, controlsFilter }: ControlsSelectionProps) => {
    const userData = useAppSelector((state) => state.appUser);
    const { field: { value, onChange } } = useController({ name, control: formControl });

    const [controls, setControls] = useState<ControlItem[]>([]); // store all the controls
    const [selectedControls, setSelectedControls] = useState<ControlItem[]>([]) // store all the selected controls, default all controls are selected.

    // apply filter on main controls list when user is searching...
    const filteredControls = controls.filter(controlItem =>
        controlItem.control_display_name.toLowerCase().includes(controlsFilter.toLowerCase())
    );

    // Natural sort comparison function for control IDs
    const naturalSort = (a: ControlItem, b: ControlItem) => {
        const aParts = a.control_id.split(/(\d+)/);
        const bParts = b.control_id.split(/(\d+)/);

        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
            const aPart = aParts[i];
            const bPart = bParts[i];

            // If both parts are numbers, compare numerically
            if (i % 2 === 1) { // Odd indices are the numeric parts from the split
                const aNum = parseInt(aPart, 10);
                const bNum = parseInt(bPart, 10);
                if (aNum !== bNum) return aNum - bNum;
            } else {
                // Otherwise compare as strings
                if (aPart < bPart) return -1;
                if (aPart > bPart) return 1;
            }
        }

        // If we get here, the strings are equal up to the length of the shorter one
        return aParts.length - bParts.length;
    };

    // to fetch controls from the server
    const fetchControls = async () => {
        if (!selectedFramework[0]?.value) return;

        setIsControlsLoading(true);
        try {
            const response: getControlsResponseDTO = await evaluationServices.evaluationService.getControls(
                userData.tenant_id,
                selectedFramework[0].value
            );

            // Sort controls using natural sort
            const sortedControls = [...(response.controls || [])].sort(naturalSort);

            setControls(sortedControls);
            // only set controls of the server if none are selected
            if (value.length === 0) {
                setSelectedControls(sortedControls);
            } else {
                const selectedControls = sortedControls.filter((control: ControlItem) => value.includes(control.control_id))
                setSelectedControls(selectedControls);
            }


        } catch (error) {
            console.error("Failed to fetch controls:", error);
            toast({
                title: "Error fetching controls",
                description: "Could not load the controls from the server.",
                variant: "destructive",
            });
        } finally {
            setIsControlsLoading(false);
        }
    };

    useEffect(() => {
        fetchControls();
    }, [selectedFramework]);

    // sync the form value with the selected controls id.
    useEffect(() => {
        const controlIds = selectedControls.map(control => control.control_id)
        onChange(controlIds)
    }, [selectedControls])

    return (
        <>
            {/* <div className="grid grid-cols-2 space-x-5 max-w-3xl items-center">
                <div className="relative ">
                    <Input
                        placeholder="Search controls..."
                        value={controlsFilter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="max-w-sm text-xl bg-white pl-10 text-black selection:text-black"
                        disabled={isControlsLoading}
                    />
                    <SearchIcon className="absolute left-3 top-2.5 transform text-gray-500 size-5" />
                </div>
                <Button
                    className="bg-neutral-800 hover:bg-neutral-700 text-white w-fit">
                    <PlusCircle />
                    <span>Statement of Applicability</span>
                </Button>
            </div> */}

            {isControlsLoading ? (
                <>
                    <RoundSpinner />
                </>
            ) : (
                <div className="flex flex-col lg:flex-row gap-y-12 w-full">
                    {/* Table on the left, this will show all the selected and unselected controls (also it will show filtered controls) */}
                    <div className="lg:w-1/2 w-full pr-2">
                        <div className="rounded-md border">
                            <ScrollArea className="h-[500px] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="text-nowrap">
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedControls.length === controls.length && controls.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedControls([...controls]);
                                                        } else {
                                                            setSelectedControls([]);
                                                        }
                                                    }}
                                                    aria-label="Select all"
                                                />
                                            </TableHead>
                                            <TableHead className="w-24">Control ID</TableHead>
                                            <TableHead className="w-full text-start">Control Title</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredControls.length > 0 ? (
                                            filteredControls.map((control) => (
                                                <TableRow key={control.control_id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedControls.some(c => c.control_id === control.control_id)}
                                                            onCheckedChange={(checked) => {
                                                                setSelectedControls(prev =>
                                                                    checked
                                                                        ? [...prev, control]
                                                                        : prev.filter(c => c.control_id !== control.control_id)
                                                                );
                                                            }}
                                                            aria-label={`Select ${control.control_display_name}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{control.control_id.slice(2)}</TableCell>
                                                    <TableCell>{control.control_display_name}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-[450px] text-center">
                                                    No controls found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Table on the right, shows only unselected controls */}
                    <div className="lg:w-1/2 w-full pl-2 relative">

                        <h3 className="absolute -top-8 right-2 text-base">
                            Deselected controls
                        </h3>


                        <div className="rounded-md border">
                            <ScrollArea className="h-[calc(500px)] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="relative text-nowrap">
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={false}
                                                    onCheckedChange={() => {
                                                        // Get all currently visible unselected controls
                                                        const visibleUnselected = controls.filter(control =>
                                                            !selectedControls.some(selected => selected.control_id === control.control_id) &&
                                                            control.control_display_name.toLowerCase().includes(controlsFilter.toLowerCase())
                                                        );
                                                        // Add them to selected controls
                                                        setSelectedControls(prev => [...prev, ...visibleUnselected]);
                                                    }}
                                                    aria-label="Select all visible controls"
                                                />
                                            </TableHead>
                                            <TableHead className="w-24">Control ID</TableHead>
                                            <TableHead className="w-full text-start">Control Title</TableHead>

                                            <span className="text-sm text-muted-foreground absolute right-3 top-1/4">
                                                {controls.filter(control =>
                                                    !selectedControls.some(selected => selected.control_id === control.control_id)
                                                ).length} control(s)
                                            </span>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {controls
                                            .filter(control =>
                                                !selectedControls.some(selected => selected.control_id === control.control_id) &&
                                                control.control_display_name.toLowerCase().includes(controlsFilter.toLowerCase())
                                            )
                                            .map((control) => (
                                                <TableRow key={`deselected-${control.control_id}`}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={false}
                                                            onCheckedChange={() => {
                                                                setSelectedControls(prev => [...prev, control]);
                                                            }}
                                                            aria-label={`Select ${control.control_display_name}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{control.control_id.slice(2)}</TableCell>
                                                    <TableCell>{control.control_display_name}</TableCell>
                                                </TableRow>
                                            ))}
                                        {controls.every(control =>
                                            selectedControls.some(selected => selected.control_id === control.control_id) ||
                                            !control.control_display_name.toLowerCase().includes(controlsFilter.toLowerCase())
                                        ) && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="h-[450px] text-center">
                                                        {controls.length === 0 ? 'No controls available' : 'Controls you deselect will show up here'}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ControlsSelection;