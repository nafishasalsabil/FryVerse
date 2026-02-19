import { useRef } from 'react';
import { useReveal } from '@/animations/useReveal';

const Locations = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useReveal(sectionRef, { stagger: 0.2 });

  const locations = [
    {
      name: 'Downtown Flagship',
      address: '123 Main Street',
      city: 'New York, NY 10001',
      hours: 'Mon-Sun: 11am - 11pm',
      phone: '(212) 555-0123',
    },
    {
      name: 'Brooklyn Heights',
      address: '456 Brooklyn Ave',
      city: 'Brooklyn, NY 11201',
      hours: 'Mon-Sun: 11am - 10pm',
      phone: '(718) 555-0456',
    },
    {
      name: 'Queens Plaza',
      address: '789 Queens Blvd',
      city: 'Queens, NY 11101',
      hours: 'Mon-Sat: 11am - 10pm, Sun: 12pm - 9pm',
      phone: '(347) 555-0789',
    },
  ];

  return (
    <section
      id="locations"
      ref={sectionRef}
      className="py-24 bg-gray-50 dark:bg-gray-950"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-reveal>
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            Find Us
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Visit one of our locations and experience FRYVERSE in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <div key={index} className="card p-6" data-reveal>
              <h3 className="text-2xl font-display font-bold mb-2">{location.name}</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                <p>{location.address}</p>
                <p>{location.city}</p>
                <p className="font-medium">{location.hours}</p>
                <p>{location.phone}</p>
              </div>
              <button className="btn-outline w-full">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
