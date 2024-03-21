

import { Navbar } from "../components/Landing/navbar";
import React, { useState } from 'react';
import './Policies.scss';


interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
  }
  
  const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isVisible, setIsVisible] = useState(false); // Initially not visible
  
    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };
  
    return (
      <div className="policyContainer">
        <h1 onClick={toggleVisibility} className={isVisible ? "" : "minimized"}>
          {title}
        </h1>
        {isVisible && (
          <div className="content">
            {children}
          </div>
        )}
      </div> 
    );
  };

const Policies: React.FC = () => {
  return (
    <>
      <CollapsibleSection title="Privacy Policy">
        <p><span className='subtitle'>At Joints</span>, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you use Joints and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>

        <p><span className='subtitle'>Information We Collect</span>: We collect several types of information from and about users of our App, including information by which you may be personally identified, such as name, postal address, email address, telephone number, and any other identifier by which you may be contacted online or offline .</p>

        <p><span className='subtitle'>How We Use Your Information</span>: We use information that we collect about you or that you provide to us, including any personal information, to present our App and its contents to you, provide you with information, products, or services that you request from us, fulfill any other purpose for which you provide it, and carry out our obligations and enforce our rights arising from any contracts entered into between you and us.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Terms of Service">
        <p><span className='subtitle'>Acceptance of the Terms</span>: By accessing or using our App, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our App.</p>

        <p><span className='subtitle'>Use of the App</span>: Joints grants you a personal, non-transferable, and non-exclusive right and license to use the resources of the App provided that you do not (and do not allow any third party to) copy, modify, create a derivative work of, reverse engineer, reverse assemble, or otherwise attempt to discover any source code of the App.</p>

        <p><span className='subtitle'>User Conduct</span>: You agree not to use the App to: upload, post, email, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Acceptable Use Policy">
        <p><span className='subtitle'>Prohibited Content</span>: You may not post any content that is illegal, threatening, defamatory, obscene, or that infringes intellectual property rights.</p>

        <p><span className='subtitle'>System Abuse</span>: Any unauthorized use of our system is a violation of these policies and certain federal and state laws, including the Computer Fraud and Abuse Act.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Intellectual Property Policy">
        <p><span className='subtitle'>Copyright</span>: All content included on the App, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and software, is the property of Joints or its content suppliers and protected by United States and international copyright laws.</p>

        <p><span className='subtitle'>Trademark</span>: The Joints and other marks indicated on our App are registered trademarks of Joints. They may not be used in connection with any product or service that is not Joints's, in any manner that is likely to cause confusion among customers or in any manner that disparages or discredits Joints.</p>
      </CollapsibleSection>

      <CollapsibleSection title="Community Guidelines">
        <p><span className='subtitle'>Respect Each Other</span>: Treat all members with respect and courtesy. Engage with others in a manner that is kind, constructive, and helpful.</p>

        <p><span className='subtitle'>No Harassment</span>: Do not harass, threaten, or intimidate anyone. If someone chooses not to engage with you, respect their decision.</p>

        <p><span className='subtitle'>Illegal Behavior</span>: Engaging in illegal activities or promoting illegal acts on our App is strictly prohibited.</p>

        <p><span className='subtitle'>Reporting Violations</span>: If you see something that you think may violate our guidelines, please help us by using our tools to report it.</p>
      </CollapsibleSection>
    </>
  );
};

export default Policies;



