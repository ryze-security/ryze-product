import { GenericDataTable } from '@/components/GenericDataTable'
import PageHeader from '@/components/PageHeader'
import { CompanyListDto } from '@/models/company/companyListDto'
import { useAppSelector } from '@/store/hooks'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

const columns: ColumnDef<CompanyListDto>[] = [
    {
        accessorKey: "tg_company_display_name",
        header: "Auditee Title",
    },{
        accessorKey: "created_on",
        header: "Created On",
    },{
        accessorKey: "created_by",
        header: "Created By",
    }
]


function AuditeeDashboard() {

    const auditeeData = useAppSelector((state) => state.company.data) as CompanyListDto[];


    return (
        <div className="min-h-screen font-roboto bg-black text-white p-6">
            <section className="flex justify-center items-center w-full bg-black text-white pb-0 pt-10 px-6 sm:px-12 lg:px-16">
				<PageHeader heading="Auditees" subtitle=" Entities that require security evaluations to ensure compliance and mitigate potential risks." buttonText="Add" variant='add' buttonUrl="/auditee/new" />
			</section>

            <section className="flex items-center w-full bg-black text-white pt-10 px-6 sm:px-12 lg:px-16">
                <GenericDataTable columns={columns} data={auditeeData} filterKey='tg_company_display_name' rowIdKey='tg_company_id' rowLinkPrefix='/auditee/' />
            </section>
        </div>
    )
}

export default AuditeeDashboard
