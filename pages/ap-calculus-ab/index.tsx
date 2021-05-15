import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import SplitPlane from "../../components/Topics/SplitPlane";

function Index() {
  return (
    <div className="bg-gray-200">
      <Navbar></Navbar>
      <div className="w-full px-4 pb-10 pt-10 bg-blue-500 text-white ">
        <div className="flex flex-col">
          <p className="text-gray-200 text-lg">Math</p>
          <p className="font-bold text-3xl">AP Calculus AB</p>
        </div>
      </div>
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Limits and Continuity"
        left={[
          <p>Limit Properties</p>,
          <p>Finding Limits with Algebra</p>,
          <p>The Squeeze Theorem</p>,
        ]}
        right={[
          <p>Limit Discontinuities</p>,
          <p>Continuity</p>,
          <p>The Intermmediate Value Theorem</p>,
        ]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Diffrentiation: Basic Derivative Rules"
        left={[
          <p>Average vs. Instantaneous Change</p>,
          <p>Derivatives and Continuity</p>,
        ]}
        right={[<p>Derivative Properties</p>, <p>Derivative Rules</p>]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Differentiation: Composite, Implicit, and Inverse functions"
        left={[
          <p>The Chain Rule</p>,
          <p>Implicit Diffrentiation</p>,
          <p>Inverse Function Diffrentiation</p>,
        ]}
        right={[<p>Higher order derivatives</p>]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Contextual Applications of Differentiation"
        left={[
          <p>Position, Velocity, and Acceleration</p>,
          <p>Rate of Change Problems</p>,
          <p>Related Rates</p>,
        ]}
        right={[
          <p>Approximating Functions</p>,
          <p>Using L’Hôpital’s rule to find limits of indeterminate forms</p>,
        ]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Analyzing Functions with Derivatives"
        left={[
          <p>The Mean Value Theorem</p>,
          <p>Extrema and Critical Points</p>,
          <p>Increasing vs Decreasing</p>,
          <p>Concavity and Inflection</p>,
        ]}
        right={[
          <p>The Second Derivative Test</p>,
          <p>Solving Optimization Problems</p>,
        ]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Integration and Accumulation of Change"
        left={[
          <p>Riemann Sums</p>,
          <p>Summation Practice</p>,
          <p>The Fundamental Theorem of Calculus</p>,
          <p>Properties of Definite Integrals</p>,
        ]}
        right={[
          <p>Antiderivatives and Indefinite Integrals</p>,
          <p>Integrating with Subsitution</p>,
          <p>Other Integration Problems</p>,
        ]}
      />
      <SplitPlane
        image="https://cdn.kastatic.org/genfiles/topic-icons/icons/ap_calculus_ab.png-60df6c-128c.png"
        title="Applications of Integration"
        left={[
          <p>Average Value of a Function</p>,
          <p>Area Between Curves</p>,
          <p>Calculating Volume: Disc Method</p>,
        ]}
        right={[
          <p>Calculating Volume: Washer Method</p>,
          <p>Calculating Volume: Cross Sections</p>,
        ]}
      />
    </div>
  );
}

export default Index;
