import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const FadeInSection = ({ children, delay = 0 }) => {
	const ref = useRef(null);
	const controls = useAnimation();
	const inView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

	useEffect(() => {
		if (inView) {
			controls.start('visible');
		}
	}, [inView]);

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: 30 },
				visible: {
					opacity: 1,
					y: 0,
					transition: {
						duration: 0.6,
						delay,
						ease: 'easeOut',
					},
				},
			}}
		>
			{children}
		</motion.div>
	);
};