import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">LV</span>
              </div>
              <span className="font-bold text-xl">LocalVibe</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Discover local gems—restaurants, events, and hidden spots near you.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/browse" className="text-muted-foreground hover:text-foreground">Browse Businesses</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Business</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/business/add" className="text-muted-foreground hover:text-foreground">List Your Business</Link></li>
              <li><Link href="/business/manage" className="text-muted-foreground hover:text-foreground">Manage Listing</Link></li>
              <li><Link href="/advertise" className="text-muted-foreground hover:text-foreground">Advertise</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 LocalVibe. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <p className="text-muted-foreground text-sm">
              Trusted by 1,200+ local businesses • 8,500+ reviews
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-primary/5 rounded-2xl text-center">
          <h3 className="font-semibold text-lg mb-2">Own a business?</h3>
          <p className="text-muted-foreground mb-4">Get listed for free and reach more customers.</p>
          <Link href="/business/add" className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors">
            Get Listed for Free
          </Link>
        </div>
      </div>
    </footer>
  );
}