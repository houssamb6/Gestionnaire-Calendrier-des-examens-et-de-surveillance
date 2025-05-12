import { useState } from "react";
import { Download, Calendar, Users, BookOpen, FileText, Filter, Printer, BarChart3, PieChart } from 'lucide-react';

function ReportsPage({ userData }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  
  const reports = [
    {
      id: 1,
      title: 'Exam Validation Summary - Spring 2024',
      description: 'A comprehensive summary of all exam validations for the Spring 2024 semester.',
      date: '2024-06-15',
      category: 'exam',
      status: 'completed',
      format: 'pdf'
    },
    {
      id: 2,
      title: 'Student Performance Analysis',
      description: 'Analysis of student performance across all courses in the department.',
      date: '2024-06-12',
      category: 'student',
      status: 'completed',
      format: 'excel'
    },
    {
      id: 3,
      title: 'Supervisor Assignment Report',
      description: 'Detailed report of supervisor assignments and workload distribution.',
      date: '2024-06-10',
      category: 'supervisor',
      status: 'completed',
      format: 'pdf'
    },
    {
      id: 4,
      title: 'Course Success Rates',
      description: 'Analysis of pass/fail rates for all courses in the department.',
      date: '2024-05-28',
      category: 'performance',
      status: 'completed',
      format: 'excel'
    },
    {
      id: 5,
      title: 'Exam Room Utilization',
      description: 'Statistics on room usage and capacity for exams.',
      date: '2024-05-20',
      category: 'exam',
      status: 'completed',
      format: 'pdf'
    },
    {
      id: 6,
      title: 'Department Budget Report',
      description: 'Financial report for department operations and resources.',
      date: '2024-06-25',
      category: 'performance',
      status: 'pending',
      format: 'excel'
    },
    {
      id: 7,
      title: 'Student Enrollment Trends',
      description: 'Analysis of enrollment patterns over the last 5 semesters.',
      date: '2024-07-05',
      category: 'student',
      status: 'scheduled',
      format: 'csv'
    },
    {
      id: 8,
      title: 'Supervisor Performance Evaluation',
      description: 'Evaluation metrics for supervisor performance in exams.',
      date: '2024-07-10',
      category: 'supervisor',
      status: 'scheduled',
      format: 'pdf'
    }
  ];

  const categories = [
    { id: 'exam', name: 'Exam Reports', icon: BookOpen },
    { id: 'student', name: 'Student Reports', icon: Users },
    { id: 'supervisor', name: 'Supervisor Reports', icon: Users },
    { id: 'performance', name: 'Performance Reports', icon: BarChart3 }
  ];

  const formats = ['pdf', 'excel', 'csv'];

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory ? report.category === activeCategory : true;
    const matchesFormat = selectedFormat ? report.format === selectedFormat : true;
    return matchesCategory && matchesFormat;
  });

  const getCategoryIcon = (category) => {
    const found = categories.find(c => c.id === category);
    const Icon = found ? found.icon : FileText;
    return <Icon className="h-5 w-5" />;
  };

  const getFormatBadgeClass = (format) => {
    switch (format) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'excel':
        return 'bg-green-100 text-green-800';
      case 'csv':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className={`p-4 rounded-lg flex items-center transition-colors ${
              activeCategory === category.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-800 shadow hover:bg-gray-50'
            }`}
          >
            <div className={`p-2 rounded-full mr-3 ${
              activeCategory === category.id ? 'bg-blue-500' : 'bg-blue-100'
            }`}>
              <category.icon className={`h-5 w-5 ${
                activeCategory === category.id ? 'text-white' : 'text-blue-600'
              }`} />
            </div>
            <span className="font-medium">{category.name}</span>
            <span className="ml-auto bg-opacity-20 text-sm px-2 py-1 rounded-full bg-gray-100">
              {reports.filter(r => r.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Format Filter */}
      <div className="flex space-x-2 mb-6">
        <span className="text-gray-700 font-medium">Format:</span>
        <button
          onClick={() => setSelectedFormat(null)}
          className={`px-3 py-1 text-sm rounded-full ${
            selectedFormat === null ? 'bg-gray-200' : 'bg-gray-100'
          }`}
        >
          All
        </button>
        {formats.map(format => (
          <button
            key={format}
            onClick={() => setSelectedFormat(selectedFormat === format ? null : format)}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedFormat === format ? getFormatBadgeClass(format) : 'bg-gray-100'
            }`}
          >
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div 
            key={report.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-full ${
                  report.category === 'exam' ? 'bg-blue-100' :
                  report.category === 'student' ? 'bg-green-100' :
                  report.category === 'supervisor' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  {getCategoryIcon(report.category)}
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getFormatBadgeClass(report.format)}`}>
                    {report.format.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{report.description}</p>
              
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{report.date}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 flex justify-between items-center">
              <span className="text-sm font-medium capitalize text-gray-500">
                {report.category} Report
              </span>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors">
                  <Printer className="h-5 w-5" />
                </button>
                <button className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="mt-12 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Report Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
              Reports by Category
            </h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">
                      {reports.filter(r => r.category === category.id).length} reports
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        category.id === 'exam' ? 'bg-blue-600' :
                        category.id === 'student' ? 'bg-green-600' :
                        category.id === 'supervisor' ? 'bg-purple-600' :
                        'bg-yellow-600'
                      }`} 
                      style={{ width: `${(reports.filter(r => r.category === category.id).length / reports.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <PieChart className="h-5 w-5 text-blue-600 mr-2" />
              Reports by Status
            </h3>
            <div className="space-y-4">
              {['completed', 'pending', 'scheduled'].map((status) => (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium capitalize">{status}</span>
                    <span className="text-sm text-gray-600">
                      {reports.filter(r => r.status === status).length} reports
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        status === 'completed' ? 'bg-green-600' :
                        status === 'pending' ? 'bg-yellow-600' :
                        'bg-blue-600'
                      }`} 
                      style={{ width: `${(reports.filter(r => r.status === status).length / reports.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Report Activity</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-06-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Exam Validation Summary</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userData.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Generated</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-06-14</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student Performance Analysis</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dr. Martinez</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Downloaded</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-06-12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Supervisor Assignment Report</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userData.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Generated</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-06-10</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Course Success Rates</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dr. Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">Shared</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportsPage;