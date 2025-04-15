
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import companyService from '@/services/companyServices';
import { CompanyListDto } from '@/models/company/companyListDto';
import { AxiosErrorInfo } from '@/utils/handleAxiosError';
import { useToast } from '@/hooks/use-toast';

const CompanySelection = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [showNewCompanyInput, setShowNewCompanyInput] = useState(false);

  const [companies, setCompanies] = useState<CompanyListDto[]>([]);
  const [error, setError] = useState<AxiosErrorInfo>(null);

  const { toast } = useToast();

  //fetches company data on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try{
        const data = await companyService.getCompanyByTenantId("alpha123");
        setCompanies(data);
      }
      catch (error) {
        setError(error);
      }
    }

    loadCompanies();
  }, []);

  useEffect(() => {
    if(error){
      toast({
        title: `Error ${error.statusCode}`,
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      })
    }
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Select or Create a Company</h1>
          <p className="text-gray-400">Choose a company to evaluate or create a new one</p>
        </div>

        <div className="grid gap-4">
          {companies.map(company => (
            <Card 
              key={company.tg_company_id} 
              className={`border transition-all cursor-pointer ${
                selectedCompany === company.tg_company_id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
              }`}
              onClick={() => setSelectedCompany(company.tg_company_id)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">{company.tg_company_display_name}</CardTitle>
                <Building2 className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Last evaluated: 3 weeks ago
                </CardDescription>
              </CardContent>
            </Card>
          ))}

          {!showNewCompanyInput ? (
            <Card 
              className="border border-dashed border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 transition-all cursor-pointer"
              onClick={() => setShowNewCompanyInput(true)}
            >
              <CardHeader className="flex justify-center items-center py-8">
                <Plus className="h-8 w-8 text-gray-500" />
                <CardTitle className="text-gray-500 mt-2">Add New Company</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <Card className="border border-blue-500 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-sm font-medium">New Company</CardTitle>
              </CardHeader>
              <CardContent>
                <Input 
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="bg-gray-800 border-0"
                  autoFocus
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <Link to="/evaluation/framework">
            <Button 
              className="bg-white hover:bg-gray-200 text-black" 
              disabled={!selectedCompany && !newCompanyName}
            >
              Continue
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;
