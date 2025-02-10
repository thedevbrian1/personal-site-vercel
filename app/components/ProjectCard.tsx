export default function ProjectCard({ imageUrl, alt, title, projectUrl }) {
    return (
        <div className="relative group fade-in">
            <div className="absolute -inset-0.5 hover:-inset-1 transition duration-1000 group-hover:duration-200 ease-in-out bg-[#c31432] blur opacity-75 group-hover:opacity-100 rounded-xl"></div>

            <div className="relative w-full bg-slightly-lighter-dark-blue p-2 rounded-xl">
                <div className="aspect-w-4 aspect-h-3">
                    <img
                        src={imageUrl}
                        alt={alt}
                        height="100%"
                        width="100%"
                        className="rounded-xl object-cover"
                    />
                </div>
                <div className="grid gap-2 mb-1 text-left">
                    <h3 className="text-body-white font-semibold text-lg lg:text-xl ml-2 mt-3 lg:mt-6">
                        {title}
                    </h3>
                    <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-body-white underline hover:text-brand-orange transition duration-300 ease-in-out">
                        View project <span className="sr-only">{title}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}