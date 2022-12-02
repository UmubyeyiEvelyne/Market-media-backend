import Clients from '../components/Clients';
import Projects from '../components/Project';
import AddClientModel from '../components/AddClientsModel';
import AddProjectModel from '../components/AddProjectsModel';

export default function Home() {
  return (
    <>
      <div className='d-flex gap-3 mb-4'>
        <AddClientModel />
        <AddProjectModel />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
}