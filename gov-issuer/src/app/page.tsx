import Navbar from './components/Navbar';
import CreateConnectionForm from './components/CreateConnectionForm';
import IssueVC from './components/IssueVC';
export default function Home() {
    return (
        <div className="grid grid-cols-3 min-h-screen max-w-7xl mx-auto gap-4 p-4 ">
            <div className="col-span-2">
                <CreateConnectionForm />
            </div>
            <div className="col-span-1">
                <IssueVC />
            </div>
        </div>
    );
}
